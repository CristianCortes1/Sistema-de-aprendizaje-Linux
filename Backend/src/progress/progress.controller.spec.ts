import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PrismaService } from '../prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

describe('ProgressController', () => {
  let controller: ProgressController;
  let service: ProgressService;

  const mockProgressService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPrismaService = {
    progresos: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        {
          provide: ProgressService,
          useValue: mockProgressService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<ProgressController>(ProgressController);
    service = module.get<ProgressService>(ProgressService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new progress record', async () => {
      const createProgressDto: CreateProgressDto = {
        progress: 50,
        userId: 1,
        lessonId: 1,
      };

      const expectedProgress = {
        id: 1,
        progreso: 50,
        Usuarios_id_Usuario: 1,
        Lecciones_id_Leccion: 1,
      };

      mockProgressService.create.mockResolvedValue(expectedProgress);

      const result = await controller.create(createProgressDto);

      expect(result).toEqual(expectedProgress);
      expect(service.create).toHaveBeenCalledWith(createProgressDto);
    });
  });

  describe('findAll', () => {
    it('should return all progress records', async () => {
      const expectedProgress = [
        { id: 1, progreso: 25, Usuarios_id_Usuario: 1 },
        { id: 2, progreso: 75, Usuarios_id_Usuario: 2 },
      ];

      mockProgressService.findAll.mockResolvedValue(expectedProgress);

      const result = await controller.findAll();

      expect(result).toEqual(expectedProgress);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single progress record', async () => {
      const expectedProgress = {
        id: 1,
        progreso: 60,
        Usuarios_id_Usuario: 1,
      };

      mockProgressService.findOne.mockResolvedValue(expectedProgress);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedProgress);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a progress record', async () => {
      const updateProgressDto: UpdateProgressDto = {
        progress: 80,
      };

      const expectedProgress = {
        id: 1,
        progreso: 80,
      };

      mockProgressService.update.mockResolvedValue(expectedProgress);

      const result = await controller.update('1', updateProgressDto);

      expect(result).toEqual(expectedProgress);
      expect(service.update).toHaveBeenCalledWith(1, updateProgressDto);
    });
  });

  describe('remove', () => {
    it('should remove a progress record', async () => {
      const deletedProgress = {
        id: 1,
        progreso: 100,
      };

      mockProgressService.remove.mockResolvedValue(deletedProgress);

      const result = await controller.remove('1');

      expect(result).toEqual(deletedProgress);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
