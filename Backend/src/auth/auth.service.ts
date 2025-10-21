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
        // On login, check if a day has passed since last update (updatedAt)
        try {
            const now = new Date();
            const dbUser = await this.prisma.usuarios.findUnique({ where: { id_Usuario: user.id_Usuario } });
            if (!dbUser) throw new UnauthorizedException('User not found');

            let shouldIncrement = false;
            const oneDayMs = 24 * 60 * 60 * 1000;
            if (dbUser.ultimoLogin) {
                const diffMs = now.getTime() - dbUser.ultimoLogin.getTime();
                if (diffMs >= oneDayMs) shouldIncrement = true;
            } else {
                // No ultimoLogin recorded - treat as eligible
                shouldIncrement = true;
            }

            let updated = dbUser;
            if (shouldIncrement) {
                updated = await this.prisma.usuarios.update({
                    where: { id_Usuario: user.id_Usuario },
                    data: { racha: { increment: 1 }, ultimoLogin: now },
                });
            } else {
                // update ultimoLogin to now to mark the login action
                updated = await this.prisma.usuarios.update({
                    where: { id_Usuario: user.id_Usuario },
                    data: { ultimoLogin: now },
                });
            }

            const payload = { username: updated.username, sub: updated.id_Usuario };
            const { contraseña, ...userSafe } = updated as any;
            return {
                access_token: this.jwtService.sign(payload),
                user: userSafe,
            };
        } catch (err) {
            // Re-throw as Unauthorized to avoid leaking details
            throw new UnauthorizedException('Login error');
        }
    }
    async register(username: string, correo: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        // 🖼️ Lee el archivo del avatar por defecto (ruta resuelta y fallback)
        const imagenPath = path.resolve(process.cwd(), 'imagen.txt')
        let base64 = ''
        try {
            base64 = (await fs.readFile(imagenPath, 'utf-8')).trim()
        } catch (err) {
            // Si no existe el archivo, usar un avatar SVG muy pequeño en base64
            const fallbackSvg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="#4caf50"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="#fff">🐧</text></svg>`
            base64 = Buffer.from(fallbackSvg).toString('base64')
        }

        const DEFAULT_AVATAR = `data:image/svg+xml;base64,${base64}`;

        const user = await this.prisma.usuarios.create({
            data: {
                username,
                correo,
                contraseña: hashed,
                avatar: DEFAULT_AVATAR,
                activo: true, // Activar usuarios inmediatamente (producción requiere AWS SES aprobado)
                confirmationToken,
            },
        });

        // Intentar enviar email de confirmación (fallar silenciosamente en Sandbox)
        try {
            await this.emailService.sendConfirmationEmail(correo, confirmationToken, username);
        } catch (error) {
            console.warn(`⚠️  Email confirmation not sent (AWS SES Sandbox): ${correo}`);
            // No lanzar error, permitir que el registro continúe
        }

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
}
