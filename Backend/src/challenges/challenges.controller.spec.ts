import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { PrismaService } from '../prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

describe('ChallengesController', () => {
  let controller: ChallengesController;
  let service: ChallengesService;

  const mockChallengesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
      controllers: [ChallengesController],
      providers: [
        {
          provide: ChallengesService,
          useValue: mockChallengesService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<ChallengesController>(ChallengesController);
    service = module.get<ChallengesService>(ChallengesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new challenge', async () => {
      const createChallengeDto: CreateChallengeDto = {
        descripcion: 'Nuevo reto',
        retroalimentacion: 'Feedback',
        leccionId: 1,
      };

      const expectedChallenge = {
        id_Reto: 1,
        descripcion: 'Nuevo reto',
        Retroalimentacion: 'Feedback',
        Lecciones_id_Leccion: 1,
      };

      mockChallengesService.create.mockResolvedValue(expectedChallenge);

      const result = await controller.create(createChallengeDto);

      expect(result).toEqual(expectedChallenge);
      expect(service.create).toHaveBeenCalledWith(createChallengeDto);
    });
  });

  describe('findAll', () => {
    it('should return all challenges', async () => {
      const expectedChallenges = [
        { id_Reto: 1, descripcion: 'Reto 1' },
        { id_Reto: 2, descripcion: 'Reto 2' },
      ];

      mockChallengesService.findAll.mockResolvedValue(expectedChallenges);

      const result = await controller.findAll();

      expect(result).toEqual(expectedChallenges);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single challenge', async () => {
      const expectedChallenge = {
        id_Reto: 1,
        descripcion: 'Reto Específico',
      };

      mockChallengesService.findOne.mockResolvedValue(expectedChallenge);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedChallenge);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const updateChallengeDto: UpdateChallengeDto = {
        descripcion: 'Descripción actualizada',
      };

      const expectedChallenge = {
        id_Reto: 1,
        descripcion: 'Descripción actualizada',
      };

      mockChallengesService.update.mockResolvedValue(expectedChallenge);

      const result = await controller.update('1', updateChallengeDto);

      expect(result).toEqual(expectedChallenge);
      expect(service.update).toHaveBeenCalledWith(1, updateChallengeDto);
    });
  });

  describe('remove', () => {
    it('should remove a challenge', async () => {
      const deletedChallenge = {
        id_Reto: 1,
        descripcion: 'Reto Eliminado',
      };

      mockChallengesService.remove.mockResolvedValue(deletedChallenge);

      const result = await controller.remove('1');

      expect(result).toEqual(deletedChallenge);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
