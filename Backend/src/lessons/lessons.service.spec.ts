import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

describe('LessonsService', () => {
  let service: LessonsService;
  let prismaService: PrismaService;

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
      providers: [
        LessonsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a lesson with retos and comandos', async () => {
      const createLessonDto: CreateLessonDto = {
        titulo: 'Introducción a Linux',
        experiencia: 100,
        retos: [
          {
            tipo: 'reto',
            descripcion: 'Aprender comandos básicos',
            Retroalimentacion: 'Bien hecho',
            comandos: [
              { comando: 'ls' },
              { comando: 'cd' },
            ],
          },
        ],
      };

      const expectedLesson = {
        id_Leccion: 1,
        Titulo: 'Introducción a Linux',
        experiencia: 100,
        retos: [
          {
            id_Reto: 1,
            descripcion: 'Aprender comandos básicos',
            Retroalimentacion: 'Bien hecho',
            comandos: [
              { id_Comando: 1, comando: 'ls' },
              { id_Comando: 2, comando: 'cd' },
            ],
          },
        ],
      };

      mockPrismaService.lecciones.create.mockResolvedValue(expectedLesson);

      const result = await service.create(createLessonDto);

      expect(result).toEqual(expectedLesson);
      expect(mockPrismaService.lecciones.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            Titulo: createLessonDto.titulo,
            experiencia: createLessonDto.experiencia,
          }),
          include: {
            retos: {
              include: { comandos: true },
            },
          },
        }),
      );
    });

    it('should handle retos without Retroalimentacion', async () => {
      const createLessonDto: CreateLessonDto = {
        titulo: 'Comandos Avanzados',
        retos: [
          {
            descripcion: 'Usar pipes',
            comandos: [{ comando: 'grep' }],
          },
        ],
      };

      const expectedLesson = {
        id_Leccion: 2,
        Titulo: 'Comandos Avanzados',
        retos: [
          {
            id_Reto: 2,
            descripcion: 'Usar pipes',
            Retroalimentacion: null,
            comandos: [{ id_Comando: 3, comando: 'grep' }],
          },
        ],
      };

      mockPrismaService.lecciones.create.mockResolvedValue(expectedLesson);

      const result = await service.create(createLessonDto);

      expect(result).toEqual(expectedLesson);
      expect(mockPrismaService.lecciones.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            retos: {
              create: [
                expect.objectContaining({
                  Retroalimentacion: null,
                }),
              ],
            },
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all lessons with retos and comandos', async () => {
      const expectedLessons = [
        {
          id_Leccion: 1,
          Titulo: 'Lección 1',
          retos: [
            {
              id_Reto: 1,
              descripcion: 'Reto 1',
              comandos: [{ id_Comando: 1, comando: 'ls' }],
            },
          ],
        },
        {
          id_Leccion: 2,
          Titulo: 'Lección 2',
          retos: [],
        },
      ];

      mockPrismaService.lecciones.findMany.mockResolvedValue(expectedLessons);

      const result = await service.findAll();

      expect(result).toEqual(expectedLessons);
      expect(mockPrismaService.lecciones.findMany).toHaveBeenCalledWith({
        include: {
          retos: {
            include: { comandos: true },
          },
        },
      });
    });

    it('should return empty array when no lessons exist', async () => {
      mockPrismaService.lecciones.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a lesson by id with retos and comandos', async () => {
      const expectedLesson = {
        id_Leccion: 1,
        Titulo: 'Lección Completa',
        retos: [
          {
            id_Reto: 1,
            descripcion: 'Reto de prueba',
            comandos: [
              { id_Comando: 1, comando: 'pwd' },
              { id_Comando: 2, comando: 'whoami' },
            ],
          },
        ],
      };

      mockPrismaService.lecciones.findUnique.mockResolvedValue(expectedLesson);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedLesson);
      expect(mockPrismaService.lecciones.findUnique).toHaveBeenCalledWith({
        where: { id_Leccion: 1 },
        include: {
          retos: {
            include: { comandos: true },
          },
        },
      });
    });

    it('should return null when lesson not found', async () => {
      mockPrismaService.lecciones.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a lesson title using transaction', async () => {
      const updateLessonDto: UpdateLessonDto = {
        titulo: 'Título Actualizado',
        experiencia: 150,
      };

      const expectedLesson = {
        id_Leccion: 1,
        Titulo: 'Título Actualizado',
        experiencia: 150,
        retos: [],
      };

      // Mock the transaction
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          lecciones: {
            update: jest.fn().mockResolvedValue({ id_Leccion: 1 }),
            findUnique: jest.fn().mockResolvedValue(expectedLesson),
          },
          retos: {
            findMany: jest.fn().mockResolvedValue([]),
          },
        };
        return callback(mockTx);
      });

      const result = await service.update(1, updateLessonDto);

      expect(result).toEqual(expectedLesson);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should update lesson with retos and comandos', async () => {
      const updateLessonDto: UpdateLessonDto = {
        titulo: 'Título Actualizado',
        experiencia: 150,
        retos: [
          {
            tipo: 'reto',
            descripcion: 'Nuevo reto',
            comandos: [{ comando: 'pwd' }],
          },
        ],
      };

      const expectedLesson = {
        id_Leccion: 1,
        Titulo: 'Título Actualizado',
        experiencia: 150,
        retos: [
          {
            id_Reto: 1,
            descripcion: 'Nuevo reto',
            comandos: [{ id_Comando: 1, comando: 'pwd' }],
          },
        ],
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          lecciones: {
            update: jest.fn().mockResolvedValue({ id_Leccion: 1 }),
            findUnique: jest.fn().mockResolvedValue(expectedLesson),
          },
          retos: {
            findMany: jest.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([
              { id_Reto: 1, Lecciones_id_Leccion: 1 },
            ]),
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
            createMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          comandos: {
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
            createMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
        };
        return callback(mockTx);
      });

      const result = await service.update(1, updateLessonDto);

      expect(result).toEqual(expectedLesson);
    });
  });

  describe('remove', () => {
    it('should delete a lesson with all its retos and comandos', async () => {
      const existingLesson = {
        id_Leccion: 1,
        Titulo: 'Lección a eliminar',
      };

      const retos = [
        { id_Reto: 1, Lecciones_id_Leccion: 1 },
        { id_Reto: 2, Lecciones_id_Leccion: 1 },
      ];

      const deletedLesson = {
        id_Leccion: 1,
        Titulo: 'Lección a eliminar',
      };

      // Mock the transaction to execute the callback
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTransactionPrisma = {
          lecciones: {
            findUnique: jest.fn().mockResolvedValue(existingLesson),
            delete: jest.fn().mockResolvedValue(deletedLesson),
          },
          retos: {
            findMany: jest.fn().mockResolvedValue(retos),
            deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          comandos: {
            deleteMany: jest.fn().mockResolvedValue({ count: 3 }),
          },
        };
        return callback(mockTransactionPrisma);
      });

      const result = await service.remove(1);

      expect(result).toEqual(deletedLesson);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw error when lesson not found', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTransactionPrisma = {
          lecciones: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(mockTransactionPrisma);
      });

      await expect(service.remove(999)).rejects.toThrow(
        'Lección con id 999 no encontrada',
      );
    });

    it('should handle deletion when lesson has no retos', async () => {
      const existingLesson = {
        id_Leccion: 1,
        Titulo: 'Lección sin retos',
      };

      const deletedLesson = {
        id_Leccion: 1,
        Titulo: 'Lección sin retos',
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTransactionPrisma = {
          lecciones: {
            findUnique: jest.fn().mockResolvedValue(existingLesson),
            delete: jest.fn().mockResolvedValue(deletedLesson),
          },
          retos: {
            findMany: jest.fn().mockResolvedValue([]),
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
          comandos: {
            deleteMany: jest.fn(),
          },
        };
        return callback(mockTransactionPrisma);
      });

      const result = await service.remove(1);

      expect(result).toEqual(deletedLesson);
    });
  });
});
