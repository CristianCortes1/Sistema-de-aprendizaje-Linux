import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

describe('LessonsController', () => {
  let controller: LessonsController;
  let service: LessonsService;

  const mockLessonsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPrismaService = {
    lecciones: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    retos: {
      findMany: jest.fn(),
    },
    comandos: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        {
          provide: LessonsService,
          useValue: mockLessonsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
    service = module.get<LessonsService>(LessonsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new lesson', async () => {
      const createLessonDto: CreateLessonDto = {
        titulo: 'Nueva Lección',
        retos: [
          {
            descripcion: 'Reto 1',
            comandos: [{ comando: 'ls' }],
          },
        ],
      };

      const expectedLesson = {
        id_Leccion: 1,
        Titulo: 'Nueva Lección',
        retos: [
          {
            id_Reto: 1,
            descripcion: 'Reto 1',
            comandos: [{ id_Comando: 1, comando: 'ls' }],
          },
        ],
      };

      mockLessonsService.create.mockResolvedValue(expectedLesson);

      const result = await controller.create(createLessonDto);

      expect(result).toEqual(expectedLesson);
      expect(service.create).toHaveBeenCalledWith(createLessonDto);
    });
  });

  describe('findAll', () => {
    it('should return all lessons', async () => {
      const expectedLessons = [
        { id_Leccion: 1, Titulo: 'Lección 1', retos: [] },
        { id_Leccion: 2, Titulo: 'Lección 2', retos: [] },
      ];

      mockLessonsService.findAll.mockResolvedValue(expectedLessons);

      const result = await controller.findAll();

      expect(result).toEqual(expectedLessons);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single lesson', async () => {
      const expectedLesson = {
        id_Leccion: 1,
        Titulo: 'Lección Específica',
        retos: [],
      };

      mockLessonsService.findOne.mockResolvedValue(expectedLesson);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedLesson);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a lesson', async () => {
      const updateLessonDto: UpdateLessonDto = {
        titulo: 'Título Actualizado',
      };

      const expectedLesson = {
        id_Leccion: 1,
        Titulo: 'Título Actualizado',
      };

      mockLessonsService.update.mockResolvedValue(expectedLesson);

      const result = await controller.update('1', updateLessonDto);

      expect(result).toEqual(expectedLesson);
      expect(service.update).toHaveBeenCalledWith(1, updateLessonDto);
    });
  });

  describe('remove', () => {
    it('should remove a lesson', async () => {
      const deletedLesson = {
        id_Leccion: 1,
        Titulo: 'Lección Eliminada',
      };

      mockLessonsService.remove.mockResolvedValue(deletedLesson);

      const result = await controller.remove('1');

      expect(result).toEqual(deletedLesson);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
