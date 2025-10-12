import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
<<<<<<< HEAD
<<<<<<< HEAD
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.usuarios.findUnique({
      where: { username },
    });

    if (user && await bcrypt.compare(password, user.contraseña)) {
      const { contraseña, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id_Usuario };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, correo: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.usuarios.create({
      data: {
        username,
        correo,
        contraseña: hashed,
      },
    });
  }
=======
=======
import * as crypto from 'crypto';
>>>>>>> Backend
import { promises as fs } from 'fs';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.prisma.usuarios.findFirst({
            where: { username },
        });
        if (user && await bcrypt.compare(password, user.contraseña)) {
            if (!user.activo) {
                throw new UnauthorizedException('Account not activated. Please check your email.');
            }
            const { contraseña, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id_Usuario };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async register(username: string, correo: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        // 🖼️ Lee el archivo del avatar por defecto
        const base64 = await fs.readFile(
            'imagen.txt', // 👉 ajusta la ruta según tu proyecto
            'utf-8'
        );

        const DEFAULT_AVATAR = `data:image/svg+xml;base64,${base64.trim()}`;

        const user = await this.prisma.usuarios.create({
            data: {
                username,
                correo,
                contraseña: hashed,
                avatar: DEFAULT_AVATAR,
                activo: false,
                confirmationToken,
            },
        });

        // Send confirmation email
        await this.emailService.sendConfirmationEmail(correo, confirmationToken, username);

        const { contraseña, confirmationToken: token, ...result } = user;
        return result;
    }

    async confirmEmail(token: string) {
        const user = await this.prisma.usuarios.findFirst({
            where: { confirmationToken: token },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid confirmation token');
        }

        const updatedUser = await this.prisma.usuarios.update({
            where: { id_Usuario: user.id_Usuario },
            data: {
                activo: true,
                confirmationToken: null,
            },
        });

        const { contraseña, ...result } = updatedUser;
        return result;
    }

    async testEmailService() {
        // Método de prueba para diagnosticar problemas de email
        await this.emailService.sendConfirmationEmail(
            process.env.EMAIL_USER || 'test@example.com', // Enviar a tu propio email
            'test-token-123',
            'TestUser'
        );
    }
>>>>>>> Backend
}
