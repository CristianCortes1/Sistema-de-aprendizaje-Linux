import { Test, TestingModule } from '@nestjs/testing';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { PrismaService } from '../prisma.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';

describe('CommandsController', () => {
  let controller: CommandsController;
  let service: CommandsService;

  const mockCommandsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
      controllers: [CommandsController],
      providers: [
        {
          provide: CommandsService,
          useValue: mockCommandsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<CommandsController>(CommandsController);
    service = module.get<CommandsService>(CommandsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockCommandsService.create.mockResolvedValue(expectedCommand);

      const result = await controller.create(createCommandDto);

      expect(result).toEqual(expectedCommand);
      expect(service.create).toHaveBeenCalledWith(createCommandDto);
    });
  });

  describe('findAll', () => {
    it('should return all commands', async () => {
      const expectedCommands = [
        { id_Comando: 1, comando: 'ls' },
        { id_Comando: 2, comando: 'cd' },
      ];

      mockCommandsService.findAll.mockResolvedValue(expectedCommands);

      const result = await controller.findAll();

      expect(result).toEqual(expectedCommands);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single command', async () => {
      const expectedCommand = {
        id_Comando: 1,
        comando: 'pwd',
      };

      mockCommandsService.findOne.mockResolvedValue(expectedCommand);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedCommand);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a command', async () => {
      const updateCommandDto: UpdateCommandDto = {
        comando: 'ls -lah',
      };

      const expectedCommand = {
        id_Comando: 1,
        comando: 'ls -lah',
      };

      mockCommandsService.update.mockResolvedValue(expectedCommand);

      const result = await controller.update('1', updateCommandDto);

      expect(result).toEqual(expectedCommand);
      expect(service.update).toHaveBeenCalledWith(1, updateCommandDto);
    });
  });

  describe('remove', () => {
    it('should remove a command', async () => {
      const deletedCommand = {
        id_Comando: 1,
        comando: 'rm test.txt',
      };

      mockCommandsService.remove.mockResolvedValue(deletedCommand);

      const result = await controller.remove('1');

      expect(result).toEqual(deletedCommand);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
