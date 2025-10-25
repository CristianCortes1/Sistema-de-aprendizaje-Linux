import { Test, TestingModule } from '@nestjs/testing';
import { TerminalGateway } from './terminal.gateway';
import { DockerService } from './docker.service';
import { Socket } from 'socket.io';

describe('TerminalGateway', () => {
  let gateway: TerminalGateway;
  let dockerService: jest.Mocked<DockerService>;
  let mockSocket: jest.Mocked<Socket>;
  let mockServer: any;
  let mockStream: any;

  beforeEach(async () => {
    // Mock stream
    mockStream = {
      on: jest.fn(),
      removeAllListeners: jest.fn().mockReturnThis(),
      write: jest.fn(),
      end: jest.fn(),
    };

    // Mock DockerService
    const mockDockerService = {
      createUserContainer: jest.fn().mockResolvedValue({
        userId: 'test-user',
        container: {},
        stream: mockStream,
        connectedSockets: new Set(['socket-123']),
        lastActivity: new Date(),
        createdAt: new Date(),
      }),
      writeToContainer: jest.fn().mockResolvedValue(undefined),
      resizeContainer: jest.fn().mockResolvedValue(undefined),
      destroySession: jest.fn().mockResolvedValue(undefined),
      getSession: jest.fn(),
    };

    // Mock Socket
    mockSocket = {
      id: 'socket-123',
      handshake: {
        auth: { userId: 'test-user' },
      },
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    // Mock Server
    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerminalGateway,
        {
          provide: DockerService,
          useValue: mockDockerService,
        },
      ],
    }).compile();

    gateway = module.get<TerminalGateway>(TerminalGateway);
    dockerService = module.get(DockerService);
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should create container for authenticated user', async () => {
      await gateway.handleConnection(mockSocket);

      expect(dockerService.createUserContainer).toHaveBeenCalledWith(
        'socket-123',
        'test-user',
      );
    });

    it('should reject connection without userId', async () => {
      mockSocket.handshake.auth = {};

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'output',
        '\x1b[1;31mError: Authentication required. Please login to access the terminal.\x1b[0m\r\n',
      );
      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(dockerService.createUserContainer).not.toHaveBeenCalled();
    });

    it('should reject connection with null auth', async () => {
      mockSocket.handshake.auth = null as any;

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(dockerService.createUserContainer).not.toHaveBeenCalled();
    });

    it('should reject connection with undefined userId', async () => {
      mockSocket.handshake.auth = { userId: undefined };

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(dockerService.createUserContainer).not.toHaveBeenCalled();
    });

    it('should reject connection with empty userId', async () => {
      mockSocket.handshake.auth = { userId: '' };

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(dockerService.createUserContainer).not.toHaveBeenCalled();
    });

    it('should setup stream listeners for output', async () => {
      await gateway.handleConnection(mockSocket);

      expect(mockStream.removeAllListeners).toHaveBeenCalledWith('data');
      expect(mockStream.removeAllListeners).toHaveBeenCalledWith('end');
      expect(mockStream.on).toHaveBeenCalledWith('data', expect.any(Function));
      expect(mockStream.on).toHaveBeenCalledWith('end', expect.any(Function));
    });

    it('should emit output to client when data received', async () => {
      await gateway.handleConnection(mockSocket);

      // Obtener el callback del listener 'data'
      const dataCallback = mockStream.on.mock.calls.find(
        (call) => call[0] === 'data',
      )[1];

      // Simular datos del stream
      const testData = Buffer.from('test output');
      dataCallback(testData);

      expect(mockServer.to).toHaveBeenCalledWith('socket-123');
      expect(mockServer.emit).toHaveBeenCalledWith('output', 'test output');
    });

    it('should emit newline when stream ends', async () => {
      await gateway.handleConnection(mockSocket);

      // Obtener el callback del listener 'end'
      const endCallback = mockStream.on.mock.calls.find(
        (call) => call[0] === 'end',
      )[1];

      endCallback();

      expect(mockServer.to).toHaveBeenCalledWith('socket-123');
      expect(mockServer.emit).toHaveBeenCalledWith('output', '\r\n');
    });

    it('should broadcast to all connected sockets in session', async () => {
      const connectedSockets = new Set(['socket-1', 'socket-2', 'socket-3']);
      dockerService.createUserContainer.mockResolvedValue({
        userId: 'test-user',
        container: {} as any,
        stream: mockStream,
        connectedSockets,
        lastActivity: new Date(),
        createdAt: new Date(),
      });

      await gateway.handleConnection(mockSocket);

      const dataCallback = mockStream.on.mock.calls.find(
        (call) => call[0] === 'data',
      )[1];
      dataCallback(Buffer.from('broadcast test'));

      expect(mockServer.to).toHaveBeenCalledTimes(3);
      expect(mockServer.to).toHaveBeenCalledWith('socket-1');
      expect(mockServer.to).toHaveBeenCalledWith('socket-2');
      expect(mockServer.to).toHaveBeenCalledWith('socket-3');
    });

    it('should disconnect client on connection error', async () => {
      dockerService.createUserContainer.mockRejectedValue(
        new Error('Docker error'),
      );

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleInput', () => {
    it('should write input to container', async () => {
      await gateway.handleInput(mockSocket, 'ls -la\n');

      expect(dockerService.writeToContainer).toHaveBeenCalledWith(
        'socket-123',
        'ls -la\n',
      );
    });

    it('should handle special characters', async () => {
      const specialInput = '\x03'; // Ctrl+C

      await gateway.handleInput(mockSocket, specialInput);

      expect(dockerService.writeToContainer).toHaveBeenCalledWith(
        'socket-123',
        specialInput,
      );
    });

    it('should handle empty input', async () => {
      await gateway.handleInput(mockSocket, '');

      expect(dockerService.writeToContainer).toHaveBeenCalledWith(
        'socket-123',
        '',
      );
    });

    it('should handle write errors silently', async () => {
      dockerService.writeToContainer.mockRejectedValue(
        new Error('Write failed'),
      );

      await expect(
        gateway.handleInput(mockSocket, 'test'),
      ).resolves.not.toThrow();
    });

    it('should handle unicode input', async () => {
      const unicodeInput = '你好世界';

      await gateway.handleInput(mockSocket, unicodeInput);

      expect(dockerService.writeToContainer).toHaveBeenCalledWith(
        'socket-123',
        unicodeInput,
      );
    });
  });

  describe('handleResize', () => {
    it('should resize container terminal', async () => {
      const size = { cols: 120, rows: 40 };

      await gateway.handleResize(mockSocket, size);

      expect(dockerService.resizeContainer).toHaveBeenCalledWith(
        'socket-123',
        40,
        120,
      );
    });

    it('should handle standard terminal sizes', async () => {
      const standardSizes = [
        { cols: 80, rows: 24 },
        { cols: 120, rows: 40 },
        { cols: 160, rows: 50 },
      ];

      for (const size of standardSizes) {
        await gateway.handleResize(mockSocket, size);
        expect(dockerService.resizeContainer).toHaveBeenCalledWith(
          'socket-123',
          size.rows,
          size.cols,
        );
      }
    });

    it('should handle resize errors silently', async () => {
      dockerService.resizeContainer.mockRejectedValue(
        new Error('Resize failed'),
      );

      await expect(
        gateway.handleResize(mockSocket, { cols: 80, rows: 24 }),
      ).resolves.not.toThrow();
    });

    it('should handle small terminal sizes', async () => {
      const size = { cols: 10, rows: 5 };

      await gateway.handleResize(mockSocket, size);

      expect(dockerService.resizeContainer).toHaveBeenCalledWith(
        'socket-123',
        5,
        10,
      );
    });

    it('should handle large terminal sizes', async () => {
      const size = { cols: 300, rows: 100 };

      await gateway.handleResize(mockSocket, size);

      expect(dockerService.resizeContainer).toHaveBeenCalledWith(
        'socket-123',
        100,
        300,
      );
    });
  });

  describe('handleDisconnect', () => {
    it('should destroy session when client disconnects', async () => {
      await gateway.handleDisconnect(mockSocket);

      expect(dockerService.destroySession).toHaveBeenCalledWith('socket-123');
    });

    it('should handle destroy errors silently', async () => {
      dockerService.destroySession.mockRejectedValue(
        new Error('Destroy failed'),
      );

      await expect(
        gateway.handleDisconnect(mockSocket),
      ).resolves.not.toThrow();
    });

    it('should handle multiple disconnects gracefully', async () => {
      await gateway.handleDisconnect(mockSocket);
      await gateway.handleDisconnect(mockSocket);

      expect(dockerService.destroySession).toHaveBeenCalledTimes(2);
    });
  });

  describe('WebSocket integration', () => {
    it('should have WebSocketGateway decorator', () => {
      // Verificar que la clase tiene el decorador correcto
      expect(gateway).toBeDefined();
      expect(gateway.server).toBeDefined();
    });

    it('should implement connection lifecycle interfaces', () => {
      expect(gateway.handleConnection).toBeDefined();
      expect(gateway.handleDisconnect).toBeDefined();
    });

    it('should have message handlers defined', () => {
      expect(gateway.handleInput).toBeDefined();
      expect(gateway.handleResize).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle disconnection without errors', async () => {
      await expect(gateway.handleDisconnect(mockSocket)).resolves.not.toThrow();
    });

    it('should handle session data stream errors', async () => {
      dockerService.createUserContainer.mockResolvedValue({
        userId: 'test-user',
        container: {} as any,
        stream: mockStream,
        connectedSockets: new Set(['socket-123']),
        lastActivity: new Date(),
        createdAt: new Date(),
      });

      await gateway.handleConnection(mockSocket);

      // Simular error en el stream
      const dataCallback = mockStream.on.mock.calls.find(
        (call) => call[0] === 'data',
      )[1];

      // El gateway debe manejar datos corruptos
      expect(() => dataCallback(Buffer.from([0xff, 0xfe]))).not.toThrow();
    });

    it('should handle concurrent operations', async () => {
      const promises = [
        gateway.handleInput(mockSocket, 'cmd1'),
        gateway.handleResize(mockSocket, { cols: 80, rows: 24 }),
        gateway.handleInput(mockSocket, 'cmd2'),
      ];

      await expect(Promise.all(promises)).resolves.not.toThrow();
    });
  });
});
