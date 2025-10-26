import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './challenges.service';
import { PrismaService } from '../prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    retos: {
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
        ChallengesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new challenge', async () => {
      const createChallengeDto: CreateChallengeDto = {
        descripcion: 'Listar archivos ocultos',
        retroalimentacion: 'Usa ls -a para ver archivos ocultos',
        leccionId: 1,
      };

      const expectedChallenge = {
        id_Reto: 1,
        descripcion: 'Listar archivos ocultos',
        Retroalimentacion: 'Usa ls -a para ver archivos ocultos',
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.retos.create.mockResolvedValue(expectedChallenge);

      const result = await service.create(createChallengeDto);

      expect(result).toEqual(expectedChallenge);
      expect(mockPrismaService.retos.create).toHaveBeenCalledWith({
        data: {
          descripcion: createChallengeDto.descripcion,
          Retroalimentacion: createChallengeDto.retroalimentacion,
          Lecciones_id_Leccion: createChallengeDto.leccionId,
        },
      });
    });

    it('should create a challenge without retroalimentacion', async () => {
      const createChallengeDto: CreateChallengeDto = {
        descripcion: 'Navegar al directorio home',
        leccionId: 2,
      };

      const expectedChallenge = {
        id_Reto: 2,
        descripcion: 'Navegar al directorio home',
        Retroalimentacion: undefined,
        Lecciones_id_Leccion: 2,
      };

      mockPrismaService.retos.create.mockResolvedValue(expectedChallenge);

      const result = await service.create(createChallengeDto);

      expect(result).toEqual(expectedChallenge);
    });
  });

  describe('findAll', () => {
    it('should return all challenges', async () => {
      const expectedChallenges = [
        {
          id_Reto: 1,
          descripcion: 'Challenge 1',
          Retroalimentacion: 'Feedback 1',
          Lecciones_id_Leccion: 1,
        },
        {
          id_Reto: 2,
          descripcion: 'Challenge 2',
          Retroalimentacion: null,
          Lecciones_id_Leccion: 2,
        },
      ];

      mockPrismaService.retos.findMany.mockResolvedValue(expectedChallenges);

      const result = await service.findAll();

      expect(result).toEqual(expectedChallenges);
      expect(mockPrismaService.retos.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no challenges exist', async () => {
      mockPrismaService.retos.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a challenge by id', async () => {
      const expectedChallenge = {
        id_Reto: 1,
        descripcion: 'Crear un directorio',
        Retroalimentacion: 'Usa mkdir',
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.retos.findUnique.mockResolvedValue(expectedChallenge);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedChallenge);
      expect(mockPrismaService.retos.findUnique).toHaveBeenCalledWith({
        where: { id_Reto: 1 },
      });
    });

    it('should return null when challenge not found', async () => {
      mockPrismaService.retos.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const updateChallengeDto: UpdateChallengeDto = {
        descripcion: 'Descripción actualizada',
        retroalimentacion: 'Nueva retroalimentación',
        leccionId: 2,
      };

      const expectedChallenge = {
        id_Reto: 1,
        descripcion: 'Descripción actualizada',
        Retroalimentacion: 'Nueva retroalimentación',
        Lecciones_id_Leccion: 2,
      };

      mockPrismaService.retos.update.mockResolvedValue(expectedChallenge);

      const result = await service.update(1, updateChallengeDto);

      expect(result).toEqual(expectedChallenge);
      expect(mockPrismaService.retos.update).toHaveBeenCalledWith({
        where: { id_Reto: 1 },
        data: {
          descripcion: updateChallengeDto.descripcion,
          Retroalimentacion: updateChallengeDto.retroalimentacion,
          Lecciones_id_Leccion: updateChallengeDto.leccionId,
        },
      });
    });

    it('should update only provided fields', async () => {
      const updateChallengeDto: UpdateChallengeDto = {
        descripcion: 'Solo descripción',
      };

      const expectedChallenge = {
        id_Reto: 1,
        descripcion: 'Solo descripción',
        Retroalimentacion: 'Old feedback',
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.retos.update.mockResolvedValue(expectedChallenge);

      const result = await service.update(1, updateChallengeDto);

      expect(result).toEqual(expectedChallenge);
    });
  });

  describe('remove', () => {
    it('should delete a challenge', async () => {
      const deletedChallenge = {
        id_Reto: 1,
        descripcion: 'Challenge eliminado',
        Retroalimentacion: 'Feedback',
        Lecciones_id_Leccion: 1,
      };

      mockPrismaService.retos.delete.mockResolvedValue(deletedChallenge);

      const result = await service.remove(1);

      expect(result).toEqual(deletedChallenge);
      expect(mockPrismaService.retos.delete).toHaveBeenCalledWith({
        where: { id_Reto: 1 },
      });
    });
  });
});
