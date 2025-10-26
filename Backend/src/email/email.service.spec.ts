import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

// Mock de nodemailer
jest.mock('nodemailer');
jest.mock('@sendgrid/mail');

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: any;

  const originalEnv = process.env;

  beforeEach(async () => {
    // Reset environment
    process.env = { ...originalEnv };
    jest.clearAllMocks();

    // Mock transporter
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
      }),
      verify: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init - SendGrid', () => {
    it('should initialize with SendGrid in production when API key is available', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SENDGRID_API_KEY = 'test-api-key';

      const setApiKeySpy = jest.spyOn(sgMail, 'setApiKey');

      await service['init']();

      expect(setApiKeySpy).toHaveBeenCalledWith('test-api-key');
      expect(service['useSendgrid']).toBe(true);
      expect(service['ready']).toBe(true);
    });
  });

  describe('init - AWS SES SMTP', () => {
    it('should initialize with AWS SES SMTP in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.AWS_SES_SMTP_USER = 'aws-user';
      process.env.AWS_SES_SMTP_PASSWORD = 'aws-password';
      process.env.AWS_SES_SMTP_HOST = 'email-smtp.us-east-1.amazonaws.com';

      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      await service['init']();

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: 587,
          secure: false,
          auth: {
            user: 'aws-user',
            pass: 'aws-password',
          },
        }),
      );
      expect(mockTransporter.verify).toHaveBeenCalled();
      expect(service['ready']).toBe(true);
      expect(service['useSendgrid']).toBe(false);
    });

    it('should use default AWS SES host if not provided', async () => {
      process.env.NODE_ENV = 'production';
      process.env.AWS_SES_SMTP_USER = 'aws-user';
      process.env.AWS_SES_SMTP_PASSWORD = 'aws-password';

      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      await service['init']();

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'email-smtp.us-east-2.amazonaws.com',
        }),
      );
    });
  });

  describe('init - Development (Ethereal)', () => {
    it('should initialize with Ethereal in development', async () => {
      process.env.NODE_ENV = 'development';

      const mockTestAccount = {
        user: 'test@ethereal.email',
        pass: 'test-password',
        smtp: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
        },
      };

      (nodemailer.createTestAccount as jest.Mock).mockResolvedValue(
        mockTestAccount,
      );
      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      await service['init']();

      expect(nodemailer.createTestAccount).toHaveBeenCalled();
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
        }),
      );
      expect(service['ready']).toBe(true);
    });

    it('should fallback to stream transport if Ethereal fails', async () => {
      process.env.NODE_ENV = 'development';

      (nodemailer.createTestAccount as jest.Mock).mockRejectedValue(
        new Error('Ethereal unavailable'),
      );
      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      await service['init']();

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          streamTransport: true,
          newline: 'unix',
          buffer: true,
        }),
      );
      expect(service['ready']).toBe(true);
    });
  });

  describe('init - Production SMTP fallback', () => {
    it('should initialize with SMTP in production when no API key', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'smtp-user';
      process.env.SMTP_PASS = 'smtp-password';

      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      await service['init']();

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'smtp.example.com',
          port: 587,
          auth: {
            user: 'smtp-user',
            pass: 'smtp-password',
          },
        }),
      );
      expect(mockTransporter.verify).toHaveBeenCalled();
      expect(service['ready']).toBe(true);
    });

    it('should use secure connection when port is 465', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SMTP_PORT = '465';
      process.env.SMTP_USER = 'smtp-user';
      process.env.SMTP_PASS = 'smtp-password';

      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      await service['init']();

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 465,
          secure: true,
        }),
      );
    });

    it('should handle initialization errors gracefully', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SMTP_USER = 'smtp-user';
      process.env.SMTP_PASS = 'smtp-password';

      mockTransporter.verify.mockRejectedValue(new Error('Connection failed'));
      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await service['init']();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error inicializando email transporter'),
        expect.any(String),
      );
      expect(service['ready']).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('sendConfirmationEmail - SendGrid', () => {
    it('should send confirmation email using SendGrid', async () => {
      // Inicializar con SendGrid
      process.env.NODE_ENV = 'production';
      process.env.SENDGRID_API_KEY = 'test-api-key';
      process.env.FRONTEND_URL = 'https://example.com';
      process.env.EMAIL_FROM = 'test@example.com';

      await service['init']();

      const mockSendResponse = [{ statusCode: 202 }];
      (sgMail.send as jest.Mock).mockResolvedValue(mockSendResponse);

      const result = await service.sendConfirmationEmail(
        'user@example.com',
        'token123',
        'TestUser',
      );

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@example.com',
          from: 'test@example.com',
          subject: 'Confirma tu cuenta - Penguin Path',
          html: expect.stringContaining('TestUser'),
        }),
      );
      expect(result).toEqual(mockSendResponse);
    });

    it('should include confirmation URL with token', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SENDGRID_API_KEY = 'test-api-key';
      process.env.FRONTEND_URL = 'https://example.com';

      await service['init']();

      (sgMail.send as jest.Mock).mockResolvedValue([{ statusCode: 202 }]);

      await service.sendConfirmationEmail(
        'user@example.com',
        'abc123',
        'TestUser',
      );

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(
            'https://example.com/confirm-email?token=abc123',
          ),
        }),
      );
    });
  });

  describe('sendConfirmationEmail - SMTP', () => {
    it('should send confirmation email using SMTP transporter', async () => {
      // Inicializar con SMTP
      process.env.NODE_ENV = 'development';
      process.env.FRONTEND_URL = 'http://localhost:3000';

      const mockTestAccount = {
        user: 'test@ethereal.email',
        pass: 'test-password',
        smtp: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
        },
      };

      (nodemailer.createTestAccount as jest.Mock).mockResolvedValue(
        mockTestAccount,
      );
      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );
      (nodemailer.getTestMessageUrl as jest.Mock).mockReturnValue(
        'https://ethereal.email/message/123',
      );

      await service['init']();

      const result = await service.sendConfirmationEmail(
        'user@example.com',
        'token456',
        'JohnDoe',
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@example.com',
          subject: 'Confirma tu cuenta - Penguin Path',
          html: expect.stringContaining('JohnDoe'),
        }),
      );
      expect(result).toEqual({
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
      });
    });

    it('should use default from email if not configured', async () => {
      process.env.NODE_ENV = 'development';
      process.env.FRONTEND_URL = 'http://localhost:3000';

      const mockTestAccount = {
        user: 'test@ethereal.email',
        pass: 'test-password',
        smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
      };

      (nodemailer.createTestAccount as jest.Mock).mockResolvedValue(
        mockTestAccount,
      );
      (nodemailer.createTransport as jest.Mock).mockReturnValue(
        mockTransporter,
      );

      await service['init']();

      await service.sendConfirmationEmail(
        'user@example.com',
        'token789',
        'TestUser',
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"Penguin Path 🐧" <noreply@penguinpath.app>',
        }),
      );
    });
  });

  describe('ensureReady', () => {
    it('should throw error if transporter is not ready', async () => {
      // No inicializar el servicio
      await expect(
        service.sendConfirmationEmail(
          'user@example.com',
          'token',
          'TestUser',
        ),
      ).rejects.toThrow('Email transporter not initialized yet');
    });
  });

  describe('onModuleInit', () => {
    it('should call init on module initialization', async () => {
      const initSpy = jest.spyOn(service as any, 'init').mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(initSpy).toHaveBeenCalled();
    });
  });
});
