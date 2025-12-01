import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { PrismaService } from '../prisma.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';

describe('CommandsService', () => {
  let service: CommandsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    comandos: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommandsService>(CommandsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new command', async () => {
      const createCommandDto: CreateCommandDto = {
        comando: 'ls -la',
        retoId: 1,
      };

      const expectedCommand = {
        id_Comando: 1,
        comando: 'ls -la',
        Retos_id_Reto: 1,
      };

      mockPrismaService.comandos.create.mockResolvedValue(expectedCommand);

      const result = await service.create(createCommandDto);

      expect(result).toEqual(expectedCommand);
      expect(mockPrismaService.comandos.create).toHaveBeenCalledWith({
        data: {
          comando: createCommandDto.comando,
          descripcion: null,
          Retos_id_Reto: createCommandDto.retoId,
        },
      });
    });

    it('should create command with complex syntax', async () => {
      const createCommandDto: CreateCommandDto = {
        comando: 'grep -r "pattern" /path/to/dir | wc -l',
        retoId: 2,
      };

      const expectedCommand = {
        id_Comando: 2,
        comando: 'grep -r "pattern" /path/to/dir | wc -l',
        Retos_id_Reto: 2,
      };

      mockPrismaService.comandos.create.mockResolvedValue(expectedCommand);

      const result = await service.create(createCommandDto);

      expect(result).toEqual(expectedCommand);
    });
  });

  describe('findAll', () => {
    it('should return all commands', async () => {
      const expectedCommands = [
        {
          id_Comando: 1,
          comando: 'ls',
          Retos_id_Reto: 1,
        },
        {
          id_Comando: 2,
          comando: 'cd',
          Retos_id_Reto: 1,
        },
        {
          id_Comando: 3,
          comando: 'pwd',
          Retos_id_Reto: 2,
        },
      ];

      mockPrismaService.comandos.findMany.mockResolvedValue(expectedCommands);

      const result = await service.findAll();

      expect(result).toEqual(expectedCommands);
      expect(mockPrismaService.comandos.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no commands exist', async () => {
      mockPrismaService.comandos.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a command by id', async () => {
      const expectedCommand = {
        id_Comando: 1,
        comando: 'mkdir test',
        Retos_id_Reto: 1,
      };

      mockPrismaService.comandos.findUnique.mockResolvedValue(expectedCommand);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedCommand);
      expect(mockPrismaService.comandos.findUnique).toHaveBeenCalledWith({
        where: { id_Comando: 1 },
      });
    });

    it('should return null when command not found', async () => {
      mockPrismaService.comandos.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a command', async () => {
      const updateCommandDto: UpdateCommandDto = {
        comando: 'ls -lah',
        retoId: 2,
      };

      const expectedCommand = {
        id_Comando: 1,
        comando: 'ls -lah',
        Retos_id_Reto: 2,
      };

      mockPrismaService.comandos.update.mockResolvedValue(expectedCommand);

      const result = await service.update(1, updateCommandDto);

      expect(result).toEqual(expectedCommand);
      expect(mockPrismaService.comandos.update).toHaveBeenCalledWith({
        where: { id_Comando: 1 },
        data: {
          comando: updateCommandDto.comando,
          descripcion: null,
          Retos_id_Reto: updateCommandDto.retoId,
        },
      });
    });

    it('should update only the command text', async () => {
      const updateCommandDto: UpdateCommandDto = {
        comando: 'cat file.txt',
      };

      const expectedCommand = {
        id_Comando: 1,
        comando: 'cat file.txt',
        Retos_id_Reto: 1,
      };

      mockPrismaService.comandos.update.mockResolvedValue(expectedCommand);

      const result = await service.update(1, updateCommandDto);

      expect(result).toEqual(expectedCommand);
    });
  });

  describe('remove', () => {
    it('should delete a command', async () => {
      const deletedCommand = {
        id_Comando: 1,
        comando: 'rm test.txt',
        Retos_id_Reto: 1,
      };

      mockPrismaService.comandos.delete.mockResolvedValue(deletedCommand);

      const result = await service.remove(1);

      expect(result).toEqual(deletedCommand);
      expect(mockPrismaService.comandos.delete).toHaveBeenCalledWith({
        where: { id_Comando: 1 },
      });
    });
  });
});
