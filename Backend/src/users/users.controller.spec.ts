import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock del servicio
  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllForExperience: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    // Limpiar mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        id_Usuario: 1,
        username: 'testuser',
        correo: 'test@example.com',
        createdAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [
        { id_Usuario: 1, username: 'user1' },
        { id_Usuario: 2, username: 'user2' },
      ];

      mockUsersService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll();

      expect(result).toEqual(expectedUsers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRanking', () => {
    it('should return users ordered by experience', async () => {
      const expectedRanking = [
        { id_Usuario: 2, username: 'user2', experiencia: 200 },
        { id_Usuario: 1, username: 'user1', experiencia: 100 },
      ];

      mockUsersService.findAllForExperience.mockResolvedValue(expectedRanking);

      const result = await controller.getRanking();

      expect(result).toEqual(expectedRanking);
      expect(service.findAllForExperience).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const userId = '1';
      const expectedUser = {
        id_Usuario: 1,
        username: 'testuser',
        correo: 'test@example.com',
      };

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne(userId);

      expect(result).toEqual(expectedUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle non-existent user', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
      };

      const expectedUser = {
        id_Usuario: 1,
        username: 'updateduser',
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(expectedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(result).toEqual(expectedUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const deletedUser = {
        id_Usuario: 1,
        username: 'deleteduser',
      };

      mockUsersService.remove.mockResolvedValue(deletedUser);

      const result = await controller.remove(userId);

      expect(result).toEqual(deletedUser);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
