import { Test, TestingModule } from '@nestjs/testing';
import { DockerService } from './docker.service';
import Docker = require('dockerode');

// Mock de dockerode
jest.mock('dockerode');

describe('DockerService', () => {
  let service: DockerService;
  let mockDocker: any;
  let mockContainer: any;
  let mockStream: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock stream
    mockStream = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      pipe: jest.fn(),
      destroy: jest.fn(),
    };

    // Mock container
    mockContainer = {
      id: 'mock-container-id',
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      attach: jest.fn().mockResolvedValue(mockStream),
      inspect: jest.fn().mockResolvedValue({
        State: { Running: true },
      }),
      resize: jest.fn().mockResolvedValue(undefined),
      exec: jest.fn(),
    };

    // Mock Docker
    mockDocker = {
      getImage: jest.fn().mockReturnValue({
        inspect: jest.fn().mockResolvedValue({ Id: 'image-id' }),
      }),
      pull: jest.fn(),
      listContainers: jest.fn().mockResolvedValue([]),
      createContainer: jest.fn().mockResolvedValue(mockContainer),
      getContainer: jest.fn().mockReturnValue(mockContainer),
      modem: {
        followProgress: jest.fn((stream, cb) => cb(null)),
      },
    };

    (Docker as any).mockImplementation(() => mockDocker);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DockerService],
    }).compile();

    service = module.get<DockerService>(DockerService);

    // Esperar a que termine la inicialización
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize Docker with socket path', () => {
      expect(Docker).toHaveBeenCalledWith(
        expect.objectContaining({
          socketPath: expect.any(String),
        }),
      );
    });

    it('should use DOCKER_HOST environment variable if set', () => {
      const originalEnv = process.env.DOCKER_HOST;
      process.env.DOCKER_HOST = 'unix:///custom/docker.sock';

      // Crear nueva instancia
      new DockerService();

      expect(Docker).toHaveBeenCalledWith(
        expect.objectContaining({
          socketPath: '/custom/docker.sock',
        }),
      );

      process.env.DOCKER_HOST = originalEnv;
    });
  });

  describe('ensureImage', () => {
    it('should check if image exists', async () => {
      await service['ensureImage']();

      expect(mockDocker.getImage).toHaveBeenCalledWith(
        'penguinpath-ubuntu:latest',
      );
    });

    it('should fallback to ubuntu:22.04 if custom image not found', async () => {
      mockDocker.getImage.mockReturnValueOnce({
        inspect: jest.fn().mockRejectedValue(new Error('Image not found')),
      });
      mockDocker.getImage.mockReturnValueOnce({
        inspect: jest.fn().mockResolvedValue({ Id: 'ubuntu-id' }),
      });

      await service['ensureImage']();

      expect(mockDocker.getImage).toHaveBeenCalledWith('ubuntu:22.04');
    });

    it('should pull ubuntu:22.04 if not found locally', async () => {
      mockDocker.getImage.mockReturnValue({
        inspect: jest.fn().mockRejectedValue(new Error('Not found')),
      });
      mockDocker.pull.mockImplementation((image, cb) => {
        cb(null, {});
        return Promise.resolve();
      });

      await service['ensureImage']();

      expect(mockDocker.pull).toHaveBeenCalledWith(
        'ubuntu:22.04',
        expect.any(Function),
      );
    });
  });

  describe('cleanupOrphanedContainers', () => {
    it('should remove orphaned containers', async () => {
      mockDocker.listContainers.mockResolvedValue([
        {
          Id: 'orphan-1',
          Names: ['/penguinpath-user-123'],
        },
        {
          Id: 'other-container',
          Names: ['/some-other-app'],
        },
      ]);

      await service['cleanupOrphanedContainers']();

      expect(mockDocker.getContainer).toHaveBeenCalledWith('orphan-1');
      expect(mockContainer.stop).toHaveBeenCalled();
      expect(mockContainer.remove).toHaveBeenCalled();
    });

    it('should handle errors when stopping containers', async () => {
      mockDocker.listContainers.mockResolvedValue([
        {
          Id: 'orphan-1',
          Names: ['/penguinpath-user-123'],
        },
      ]);
      mockContainer.stop.mockRejectedValue(new Error('Already stopped'));

      await expect(
        service['cleanupOrphanedContainers'](),
      ).resolves.not.toThrow();
    });

    it('should handle listContainers errors silently', async () => {
      mockDocker.listContainers.mockRejectedValue(
        new Error('Docker not available'),
      );

      await expect(
        service['cleanupOrphanedContainers'](),
      ).resolves.not.toThrow();
    });
  });

  describe('createUserContainer', () => {
    it('should create a new container for user', async () => {
      const socketId = 'socket-123';
      const userId = '456';

      const session = await service.createUserContainer(socketId, userId);

      expect(mockDocker.createContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          Image: 'penguinpath-ubuntu:latest',
          name: 'penguinpath-user-456',
          Tty: true,
          OpenStdin: true,
          Cmd: ['/bin/bash'],
          Labels: {
            'penguinpath.user': '456',
            'penguinpath.created': expect.any(String),
          },
        }),
      );
      expect(mockContainer.start).toHaveBeenCalled();
      expect(mockContainer.attach).toHaveBeenCalled();
      expect(session).toBeDefined();
      expect(session.userId).toBe('456');
      expect(session.container).toBe(mockContainer);
    });

    it('should throw error when no userId provided', async () => {
      const socketId = 'socket-789';

      await expect(
        service.createUserContainer(socketId, ''),
      ).rejects.toThrow('userId is required - authentication needed');

      expect(mockDocker.createContainer).not.toHaveBeenCalled();
    });

    it('should throw error when userId is null', async () => {
      const socketId = 'socket-789';

      await expect(
        service.createUserContainer(socketId, null as any),
      ).rejects.toThrow('userId is required - authentication needed');

      expect(mockDocker.createContainer).not.toHaveBeenCalled();
    });

    it('should reuse existing container for same user', async () => {
      const userId = '123';
      const socketId1 = 'socket-1';
      const socketId2 = 'socket-2';

      const session1 = await service.createUserContainer(socketId1, userId);
      const session2 = await service.createUserContainer(socketId2, userId);

      expect(mockDocker.createContainer).toHaveBeenCalledTimes(1);
      expect(session1).toBe(session2);
      expect(session1.connectedSockets.size).toBe(2);
      expect(session1.connectedSockets.has(socketId1)).toBe(true);
      expect(session1.connectedSockets.has(socketId2)).toBe(true);
    });

    it('should set resource limits on container', async () => {
      await service.createUserContainer('socket-1', '1');

      expect(mockDocker.createContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          HostConfig: expect.objectContaining({
            Memory: 512 * 1024 * 1024,
            CpuQuota: 50000,
            PidsLimit: 100,
            Privileged: false,
            NetworkMode: 'none',
          }),
        }),
      );
    });

    it('should set environment variables for terminal', async () => {
      await service.createUserContainer('socket-1', '1');

      expect(mockDocker.createContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          Env: expect.arrayContaining([
            'TERM=xterm-256color',
            expect.stringContaining('PS1='),
          ]),
        }),
      );
    });

    it('should handle container creation errors', async () => {
      mockDocker.createContainer.mockRejectedValue(
        new Error('Failed to create'),
      );

      await expect(
        service.createUserContainer('socket-1', '1'),
      ).rejects.toThrow('Failed to create');
    });

    it('should update lastActivity when reusing session', async () => {
      const userId = '123';

      const session1 = await service.createUserContainer('socket-1', userId);
      const firstActivity = session1.lastActivity;

      await new Promise((resolve) => setTimeout(resolve, 10));

      const session2 = await service.createUserContainer('socket-2', userId);

      expect(session2.lastActivity.getTime()).toBeGreaterThan(
        firstActivity.getTime(),
      );
    });
  });

  describe('getSession', () => {
    it('should return session for valid socket', async () => {
      const socketId = 'socket-123';
      const userId = '456';

      await service.createUserContainer(socketId, userId);
      const session = service.getSession(socketId);

      expect(session).toBeDefined();
      expect(session?.userId).toBe(userId);
    });

    it('should return undefined for unknown socket', () => {
      const session = service.getSession('unknown-socket');

      expect(session).toBeUndefined();
    });

    it('should update lastActivity when getting session', async () => {
      const socketId = 'socket-123';
      await service.createUserContainer(socketId, '1');

      const session1 = service.getSession(socketId);
      const firstActivity = session1!.lastActivity;

      await new Promise((resolve) => setTimeout(resolve, 10));

      const session2 = service.getSession(socketId);

      expect(session2!.lastActivity.getTime()).toBeGreaterThan(
        firstActivity.getTime(),
      );
    });
  });

  describe('resizeContainer', () => {
    it('should resize container terminal', async () => {
      const socketId = 'socket-123';
      await service.createUserContainer(socketId, '1');

      await service.resizeContainer(socketId, 40, 120);

      expect(mockContainer.resize).toHaveBeenCalledWith({
        h: 40,
        w: 120,
      });
    });

    it('should throw error for unknown socket', async () => {
      await expect(
        service.resizeContainer('unknown-socket', 40, 120),
      ).rejects.toThrow('No user mapping found');
    });

    it('should throw error when session not found', async () => {
      // Simular socket con userId pero sin sesión
      service['socketToUser'].set('orphan-socket', 'orphan-user');

      await expect(
        service.resizeContainer('orphan-socket', 40, 120),
      ).rejects.toThrow('No session found for user');
    });
  });

  describe('writeToContainer', () => {
    it('should write data to container stream', async () => {
      const socketId = 'socket-123';
      await service.createUserContainer(socketId, '1');

      await service.writeToContainer(socketId, 'ls -la\n');

      expect(mockStream.write).toHaveBeenCalledWith('ls -la\n');
    });

    it('should throw error for unknown socket', async () => {
      await expect(
        service.writeToContainer('unknown-socket', 'test'),
      ).rejects.toThrow('No user mapping found');
    });

    it('should throw error when session not found', async () => {
      service['socketToUser'].set('orphan-socket', 'orphan-user');

      await expect(
        service.writeToContainer('orphan-socket', 'test'),
      ).rejects.toThrow('No active stream');
    });

    it('should update lastActivity when writing', async () => {
      await service.createUserContainer('socket-1', '1');
      const session = service.getSession('socket-1');
      const firstActivity = session!.lastActivity;

      await new Promise((resolve) => setTimeout(resolve, 10));

      await service.writeToContainer('socket-1', 'test');

      const updatedSession = service.getSession('socket-1');
      expect(updatedSession!.lastActivity.getTime()).toBeGreaterThan(
        firstActivity.getTime(),
      );
    });
  });

  describe('destroySession', () => {
    it('should remove socket from session', async () => {
      const socketId = 'socket-123';
      await service.createUserContainer(socketId, '1');

      await service.destroySession(socketId);

      const session = service.getSession(socketId);
      expect(session).toBeUndefined();
    });

    it('should keep container alive if other sockets connected', async () => {
      const userId = '1';
      await service.createUserContainer('socket-1', userId);
      await service.createUserContainer('socket-2', userId);

      await service.destroySession('socket-1');

      // La sesión debe seguir existiendo
      const session = service.getSession('socket-2');
      expect(session).toBeDefined();
      expect(session?.connectedSockets.size).toBe(1);
    });

    it('should update lastActivity when last socket disconnects', async () => {
      const userId = '1';
      await service.createUserContainer('socket-1', userId);

      await service.destroySession('socket-1');

      // El contenedor no se destruye inmediatamente, solo actualiza lastActivity
      expect(mockContainer.stop).not.toHaveBeenCalled();
    });

    it('should handle unknown socket gracefully', async () => {
      await expect(
        service.destroySession('unknown-socket'),
      ).resolves.not.toThrow();
    });

    it('should clean up socketToUser mapping', async () => {
      await service.createUserContainer('socket-1', '1');

      await service.destroySession('socket-1');

      expect(service['socketToUser'].has('socket-1')).toBe(false);
    });
  });

  describe('cleanup methods', () => {
    it('should cleanup inactive sessions', async () => {
      await service.createUserContainer('socket-1', '1');

      // Primero desconectar el socket para que connectedSockets.size sea 0
      await service.destroySession('socket-1');

      // Simular sesión inactiva (16 minutos atrás)
      const session = service['sessions'].get('1');
      if (session) {
        session.lastActivity = new Date(Date.now() - 16 * 60 * 1000);
      }

      await service['cleanupInactiveSessions'](15);

      expect(mockContainer.stop).toHaveBeenCalled();
      expect(mockContainer.remove).toHaveBeenCalled();
    });

    it('should not cleanup active sessions', async () => {
      await service.createUserContainer('socket-1', '1');

      await service['cleanupInactiveSessions'](15);

      expect(mockContainer.stop).not.toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      await service.createUserContainer('socket-1', '1');

      const session = service['sessions'].get('1');
      if (session) {
        session.lastActivity = new Date(Date.now() - 20 * 60 * 1000);
      }

      mockContainer.stop.mockRejectedValue(new Error('Cleanup failed'));

      await expect(
        service['cleanupInactiveSessions'](15),
      ).resolves.not.toThrow();
    });
  });

  describe('onModuleDestroy', () => {
    it('should cleanup all sessions on destroy', async () => {
      await service.createUserContainer('socket-1', '1');
      await service.createUserContainer('socket-2', '2');

      await service.onModuleDestroy();

      expect(mockContainer.stop).toHaveBeenCalledTimes(2);
      expect(mockContainer.remove).toHaveBeenCalledTimes(2);
    });

    it('should handle errors during destroy', async () => {
      await service.createUserContainer('socket-1', '1');
      mockContainer.stop.mockRejectedValue(new Error('Stop failed'));

      await expect(service.onModuleDestroy()).resolves.not.toThrow();
    });
  });

  describe('getStats', () => {
    it('should return container stats', async () => {
      const mockStats = {
        memory_stats: { usage: 1024000 },
        cpu_stats: { cpu_usage: { total_usage: 5000000 } },
      };
      mockContainer.stats = jest.fn().mockResolvedValue(mockStats);

      await service.createUserContainer('socket-1', '1');

      const stats = await service.getStats('socket-1');

      expect(stats).toEqual(mockStats);
      expect(mockContainer.stats).toHaveBeenCalledWith({ stream: false });
    });

    it('should return null for unknown socket', async () => {
      const stats = await service.getStats('unknown-socket');

      expect(stats).toBeNull();
    });

    it('should handle stats errors', async () => {
      mockContainer.stats = jest.fn().mockRejectedValue(new Error('Stats error'));
      await service.createUserContainer('socket-1', '1');

      const stats = await service.getStats('socket-1');

      expect(stats).toBeNull();
    });
  });

  describe('getActiveSessions', () => {
    it('should return empty array when no sessions', () => {
      const sessions = service.getActiveSessions();

      expect(sessions).toEqual([]);
    });

    it('should return all active sessions', async () => {
      await service.createUserContainer('socket-1', '1');
      await service.createUserContainer('socket-2', '2');

      const sessions = service.getActiveSessions();

      expect(sessions).toHaveLength(2);
      expect(sessions[0]).toHaveProperty('userId');
      expect(sessions[0]).toHaveProperty('createdAt');
      expect(sessions[0]).toHaveProperty('lastActivity');
      expect(sessions[0]).toHaveProperty('connectedSockets');
      expect(sessions[0]).toHaveProperty('inactiveMinutes');
    });

    it('should calculate inactive minutes correctly', async () => {
      await service.createUserContainer('socket-1', '1');

      // Simular sesión inactiva
      const session = service['sessions'].get('1');
      if (session) {
        session.lastActivity = new Date(Date.now() - 10 * 60 * 1000); // 10 minutos atrás
      }

      const sessions = service.getActiveSessions();

      expect(sessions[0].inactiveMinutes).toBeGreaterThanOrEqual(9.9);
      expect(sessions[0].inactiveMinutes).toBeLessThan(10.5);
    });

    it('should count connected sockets correctly', async () => {
      const userId = '1';
      await service.createUserContainer('socket-1', userId);
      await service.createUserContainer('socket-2', userId);
      await service.createUserContainer('socket-3', userId);

      const sessions = service.getActiveSessions();

      expect(sessions).toHaveLength(1);
      expect(sessions[0].connectedSockets).toBe(3);
    });
  });
});
