import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mock de PrismaService
  const mockPrismaService = {
    user: {
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
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        avatar: 'avatar.png',
        rol: 'user',
        activo: false,
      };

      const expectedUser = {
        id_Usuario: 1,
        username: 'testuser',
        correo: 'test@example.com',
        contraseña: 'password123',
        avatar: 'avatar.png',
        rol: 'user',
        activo: false,
        experiencia: 0,
        monedas: 0,
        racha: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: createUserDto.username,
          correo: createUserDto.email,
          contraseña: createUserDto.password,
          avatar: createUserDto.avatar,
          rol: createUserDto.rol,
          activo: createUserDto.activo,
        },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [
        {
          id_Usuario: 1,
          username: 'user1',
          correo: 'user1@example.com',
          experiencia: 100,
        },
        {
          id_Usuario: 2,
          username: 'user2',
          correo: 'user2@example.com',
          experiencia: 200,
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllForExperience', () => {
    it('should return users ordered by experience descending', async () => {
      const expectedUsers = [
        {
          id_Usuario: 2,
          username: 'user2',
          experiencia: 200,
        },
        {
          id_Usuario: 1,
          username: 'user1',
          experiencia: 100,
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(expectedUsers);

      const result = await service.findAllForExperience();

      expect(result).toEqual(expectedUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        orderBy: { experiencia: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedUser = {
        id_Usuario: 1,
        username: 'testuser',
        correo: 'test@example.com',
        experiencia: 150,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id_Usuario: userId },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      const expectedUser = {
        id_Usuario: userId,
        username: 'updateduser',
        correo: 'updated@example.com',
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(expectedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id_Usuario: userId },
        data: {
          username: updateUserDto.username,
          correo: updateUserDto.email,
          contraseña: updateUserDto.password,
          avatar: updateUserDto.avatar,
          rol: updateUserDto.rol,
          activo: updateUserDto.activo,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = 1;
      const deletedUser = {
        id_Usuario: userId,
        username: 'deleteduser',
      };

      mockPrismaService.user.delete.mockResolvedValue(deletedUser);

      const result = await service.remove(userId);

      expect(result).toEqual(deletedUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id_Usuario: userId },
      });
    });
  });
});
