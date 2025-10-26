import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    confirmEmail: jest.fn(),
    testEmailService: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        correo: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        message:
          'Usuario registrado. Por favor, revisa tu correo para confirmar tu cuenta.',
        userId: 1,
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(service.register).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.correo,
        registerDto.password,
      );
      expect(service.register).toHaveBeenCalledTimes(1);
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        username: 'existinguser',
        correo: 'existing@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockRejectedValue(
        new Error('El usuario o correo ya existe'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'El usuario o correo ya existe',
      );
    });
  });

  describe('login', () => {
    it('should login a user and return access token', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        correo: 'test@example.com',
      };

      const expectedResponse = {
        access_token: 'jwt-token-12345',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
      expect(service.login).toHaveBeenCalledWith(mockUser);
    });

    it('should handle invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      mockAuthService.validateUser.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should handle inactive user login attempt', async () => {
      const loginDto: LoginDto = {
        username: 'inactiveuser',
        password: 'password123',
      };

      mockAuthService.validateUser.mockRejectedValue(
        new Error('Account not activated. Please check your email.'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Account not activated',
      );
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email with valid token', async () => {
      const token = 'valid-token-123';
      const confirmedUser = {
        id_Usuario: 1,
        username: 'testuser',
        activo: true,
      };

      mockAuthService.confirmEmail.mockResolvedValue(confirmedUser);

      const result = await controller.confirmEmail(token);

      expect(result).toEqual({
        message: 'Email confirmed successfully',
        user: confirmedUser,
      });
      expect(service.confirmEmail).toHaveBeenCalledWith(token);
    });

    it('should handle invalid token', async () => {
      const token = 'invalid-token';

      mockAuthService.confirmEmail.mockRejectedValue(
        new Error('Token inválido o expirado'),
      );

      await expect(controller.confirmEmail(token)).rejects.toThrow(
        'Token inválido o expirado',
      );
    });

    it('should handle missing token', async () => {
      const token = '';

      mockAuthService.confirmEmail.mockRejectedValue(
        new Error('Token is required'),
      );

      await expect(controller.confirmEmail(token)).rejects.toThrow(
        'Token is required',
      );
    });
  });
});
