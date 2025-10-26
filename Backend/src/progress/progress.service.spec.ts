import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { PrismaService } from '../prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

describe('ProgressService', () => {
  let service: ProgressService;
  let prismaService: PrismaService;

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
      providers: [
        ProgressService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        createdAt: new Date(),
      };

      mockPrismaService.progresos.create.mockResolvedValue(expectedProgress);

      const result = await service.create(createProgressDto);

      expect(result).toEqual(expectedProgress);
      expect(mockPrismaService.progresos.create).toHaveBeenCalledWith({
        data: {
          progreso: createProgressDto.progress,
          Usuarios_id_Usuario: createProgressDto.userId,
          Lecciones_id_Leccion: createProgressDto.lessonId,
        },
      });
    });

    it('should create progress with 0%', async () => {
      const createProgressDto: CreateProgressDto = {
        progress: 0,
        userId: 2,
        lessonId: 3,
      };

      const expectedProgress = {
        id: 2,
        progreso: 0,
        Usuarios_id_Usuario: 2,
        Lecciones_id_Leccion: 3,
        createdAt: new Date(),
      };

      mockPrismaService.progresos.create.mockResolvedValue(expectedProgress);

      const result = await service.create(createProgressDto);

      expect(result).toEqual(expectedProgress);
    });

    it('should create progress with 100%', async () => {
      const createProgressDto: CreateProgressDto = {
        progress: 100,
        userId: 1,
        lessonId: 1,
      };

      const expectedProgress = {
        id: 3,
        progreso: 100,
        Usuarios_id_Usuario: 1,
        Lecciones_id_Leccion: 1,
        createdAt: new Date(),
      };

      mockPrismaService.progresos.create.mockResolvedValue(expectedProgress);

      const result = await service.create(createProgressDto);

      expect(result.progreso).toBe(100);
    });
  });

  describe('findAll', () => {
    it('should return all progress records', async () => {
      const expectedProgress = [
        {
          id: 1,
          progreso: 25,
          Usuarios_id_Usuario: 1,
          Lecciones_id_Leccion: 1,
        },
        {
          id: 2,
          progreso: 75,
          Usuarios_id_Usuario: 2,
          Lecciones_id_Leccion: 2,
        },
      ];

      mockPrismaService.progresos.findMany.mockResolvedValue(expectedProgress);

      const result = await service.findAll();

      expect(result).toEqual(expectedProgress);
      expect(mockPrismaService.progresos.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no progress records exist', async () => {
      mockPrismaService.progresos.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a progress record by id', async () => {
      const expectedProgress = {
        id: 1,
        progreso: 60,
        Usuarios_id_Usuario: 1,
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.progresos.findUnique.mockResolvedValue(
        expectedProgress,
      );

      const result = await service.findOne(1);

      expect(result).toEqual(expectedProgress);
      expect(mockPrismaService.progresos.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when progress record not found', async () => {
      mockPrismaService.progresos.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a progress record', async () => {
      const updateProgressDto: UpdateProgressDto = {
        progress: 80,
        userId: 1,
        lessonId: 1,
      };

      const expectedProgress = {
        id: 1,
        progreso: 80,
        Usuarios_id_Usuario: 1,
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.progresos.update.mockResolvedValue(expectedProgress);

      const result = await service.update(1, updateProgressDto);

      expect(result).toEqual(expectedProgress);
      expect(mockPrismaService.progresos.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          progreso: updateProgressDto.progress,
          Usuarios_id_Usuario: updateProgressDto.userId,
          Lecciones_id_Leccion: updateProgressDto.lessonId,
        },
      });
    });

    it('should update only progress percentage', async () => {
      const updateProgressDto: UpdateProgressDto = {
        progress: 90,
      };

      const expectedProgress = {
        id: 1,
        progreso: 90,
        Usuarios_id_Usuario: 1,
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.progresos.update.mockResolvedValue(expectedProgress);

      const result = await service.update(1, updateProgressDto);

      expect(result.progreso).toBe(90);
    });
  });

  describe('remove', () => {
    it('should delete a progress record', async () => {
      const deletedProgress = {
        id: 1,
        progreso: 100,
        Usuarios_id_Usuario: 1,
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.progresos.delete.mockResolvedValue(deletedProgress);

      const result = await service.remove(1);

      expect(result).toEqual(deletedProgress);
      expect(mockPrismaService.progresos.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
