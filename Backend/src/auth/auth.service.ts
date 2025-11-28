import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(username: string, password: string) {
    // Limpiar y normalizar entrada
    const credential = username.trim().toLowerCase();
    
    // Buscar por username o correo (case-insensitive)
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: credential, mode: 'insensitive' } },
          { correo: { equals: credential, mode: 'insensitive' } },
        ],
      },
    });

    if (user && (await bcrypt.compare(password, user.contraseña))) {
      if (!user.activo) {
        throw new UnauthorizedException(
          'Account not activated. Please check your email.',
        );
      }
      const { contraseña, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    try {
      const now = new Date();
      const dbUser = await this.prisma.user.findUnique({
        where: { id_Usuario: user.id_Usuario },
      });
      if (!dbUser) throw new UnauthorizedException('User not found');

      let newRacha = dbUser.racha;
      const oneDayMs = 24 * 60 * 60 * 1000;
      const twoDaysMs = 48 * 60 * 60 * 1000;

      if (dbUser.ultimoLogin) {
        const diffMs = now.getTime() - dbUser.ultimoLogin.getTime();

        // Si se conectó en menos de 24 horas, mantener la racha (mismo día)
        if (diffMs < oneDayMs) {
          // No hacer nada, mantener racha actual
        }
        // Si se conectó entre 24h y 48h, incrementar racha (día consecutivo)
        else if (diffMs >= oneDayMs && diffMs < twoDaysMs) {
          newRacha = dbUser.racha + 1;
        }
        // Si pasaron más de 48 horas, reiniciar racha a 1
        else {
          newRacha = 1;
        }
      } else {
        // Primera vez que hace login, establecer racha en 1
        newRacha = 1;
      }

      const updated = await this.prisma.user.update({
        where: { id_Usuario: user.id_Usuario },
        data: {
          racha: newRacha,
          ultimoLogin: now,
        },
      });

      const payload = { 
        username: updated.username, 
        sub: updated.id_Usuario,
        rol: updated.rol 
      };
      const { contraseña, ...userSafe } = updated as any;
      return {
        access_token: this.jwtService.sign(payload),
        user: userSafe,
      };
    } catch (err) {
      throw new UnauthorizedException('Login error');
    }
  }
  async register(username: string, correo: string, password: string) {
    // Limpiar y normalizar entrada
    const cleanUsername = username.trim();
    const cleanEmail = correo.trim().toLowerCase();
    
    // Verificar si ya existe un usuario con el mismo username (case-insensitive)
    const existingUsername = await this.prisma.user.findFirst({
      where: {
        username: { equals: cleanUsername, mode: 'insensitive' },
      },
    });

    if (existingUsername) {
      throw new UnauthorizedException('Username already exists');
    }

    // Verificar si ya existe un usuario con el mismo correo (case-insensitive)
    const existingEmail = await this.prisma.user.findFirst({
      where: {
        correo: { equals: cleanEmail, mode: 'insensitive' },
      },
    });

    if (existingEmail) {
      throw new UnauthorizedException('Email already exists');
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationExpires = new Date();
    confirmationExpires.setHours(confirmationExpires.getHours() + 1); // Token válido por 24 horas

    const DEFAULT_AVATAR = `/Assets/Avatar1.svg`;

    const user = await this.prisma.user.create({
      data: {
        username: cleanUsername,
        correo: cleanEmail,
        contraseña: hashed,
        avatar: DEFAULT_AVATAR,
        activo: false, // Usuario debe confirmar email
        confirmationToken,
        confirmationTokenExpires: confirmationExpires,
      },
    });

    // Enviar email de confirmación de forma asíncrona (no bloqueante)
    this.emailService.sendConfirmationEmail(
      cleanEmail,
      confirmationToken,
      cleanUsername,
    ).catch(err => {
      console.error('❌ Error enviando email de confirmación:', err?.message);
      // No lanzar error, solo loguearlo
    });

    const { contraseña, confirmationToken: token, ...result } = user;
    return result;
  }

  async confirmEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        confirmationToken: token,
        confirmationTokenExpires: {
          gt: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token de confirmación inválido o expirado. Por favor solicita un nuevo correo de confirmación.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id_Usuario: user.id_Usuario },
      data: {
        activo: true,
        confirmationToken: null,
        confirmationTokenExpires: null,
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
      'TestUser',
    );
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    // Buscar usuario por email (case-insensitive)
    const user = await this.prisma.user.findFirst({
      where: {
        correo: { equals: email.trim().toLowerCase(), mode: 'insensitive' },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.contraseña,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await this.prisma.user.update({
      where: { id_Usuario: user.id_Usuario },
      data: { contraseña: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async forgotPassword(email: string) {
    // Buscar usuario por email (case-insensitive)
    const user = await this.prisma.user.findFirst({
      where: {
        correo: { equals: email.trim().toLowerCase(), mode: 'insensitive' },
      },
    });

    if (!user) {
      // No revelar si el usuario existe o no por seguridad
      return {
        message:
          'Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña',
      };
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token válido por 1 hora

    // Guardar token en la base de datos
    await this.prisma.user.update({
      where: { id_Usuario: user.id_Usuario },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      } as any,
    });

    // Enviar correo con el link de recuperación de forma asíncrona (no bloqueante)
    this.emailService.sendPasswordResetEmail(
      user.correo,
      resetToken,
      user.username,
    ).catch(err => {
      console.error('❌ Error enviando email de recuperación:', err?.message);
      // No lanzar error, solo loguearlo
    });

    return {
      message:
        'Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Buscar usuario con el token válido y que no haya expirado
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(), // Token no expirado
        },
      }as any,
    });

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido o expirado. Por favor solicita un nuevo enlace de recuperación.',
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar tokens de recuperación
    await this.prisma.user.update({
      where: { id_Usuario: user.id_Usuario },
      data: {
        contraseña: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }as any,
    });

    return { message: 'Contraseña restablecida exitosamente' };
  }
}
