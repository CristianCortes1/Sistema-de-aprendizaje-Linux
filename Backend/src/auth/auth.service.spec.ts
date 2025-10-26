import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock de bcrypt
jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let emailService: EmailService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockEmailService = {
    sendConfirmationEmail: jest.fn(),
    testEmailService: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        contraseña: 'hashedPassword',
        activo: true,
        correo: 'test@example.com',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toEqual({
        id_Usuario: 1,
        username: 'testuser',
        activo: true,
        correo: 'test@example.com',
      });
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });

    it('should throw UnauthorizedException when user is not active', async () => {
      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        contraseña: 'hashedPassword',
        activo: false,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.validateUser('testuser', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        contraseña: 'hashedPassword',
        activo: true,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('testuser', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token and update last login', async () => {
      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        racha: 0,
        ultimoLogin: null,
      };

      const expectedToken = 'jwt-token-12345';
      const updatedUser = {
        ...mockUser,
        racha: 1,
        ultimoLogin: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);
      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: expectedToken,
        user: expect.objectContaining({
          id_Usuario: 1,
          username: 'testuser',
          racha: 1,
        }),
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id_Usuario,
      });
    });

    it('should increment racha when user logs in next day', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        racha: 5,
        ultimoLogin: yesterday,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        racha: 6,
      });
      mockJwtService.sign.mockReturnValue('token');

      await service.login(mockUser);

      expect(prismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            racha: 6,
          }),
        }),
      );
    });

    it('should reset racha when user logs in after more than 2 days', async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        racha: 10,
        ultimoLogin: threeDaysAgo,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        racha: 1,
      });
      mockJwtService.sign.mockReturnValue('token');

      await service.login(mockUser);

      expect(prismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            racha: 1,
          }),
        }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ id_Usuario: 999, username: 'fake' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and send confirmation email', async () => {
      const username = 'newuser';
      const correo = 'newuser@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      const mockCreatedUser = {
        id_Usuario: 1,
        username,
        correo,
        contraseña: hashedPassword,
        activo: false,
        confirmationToken: 'token123',
        avatar: 'data:image/svg+xml;base64,...',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockEmailService.sendConfirmationEmail.mockResolvedValue(undefined);

      const result = await service.register(username, correo, password);

      // El servicio devuelve el usuario sin contraseña ni confirmationToken
      expect(result).toEqual(
        expect.objectContaining({
          id_Usuario: 1,
          username,
          correo,
          activo: false,
        }),
      );
      expect(result).not.toHaveProperty('contraseña');
      expect(result).not.toHaveProperty('confirmationToken');
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username,
            correo,
            contraseña: hashedPassword,
            activo: false,
          }),
        }),
      );
      expect(emailService.sendConfirmationEmail).toHaveBeenCalled();
    });
  });

  describe('confirmEmail', () => {
    it('should activate user account with valid token', async () => {
      const token = 'valid-token-123';
      const mockUser = {
        id_Usuario: 1,
        username: 'testuser',
        activo: false,
        confirmationToken: token,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        activo: true,
        confirmationToken: null,
      });

      const result = await service.confirmEmail(token);

      expect(result.activo).toBe(true);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id_Usuario: 1 },
        data: {
          activo: true,
          confirmationToken: null,
        },
      });
    });

    it('should throw error with invalid token', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.confirmEmail('invalid-token')).rejects.toThrow();
    });
  });
});
