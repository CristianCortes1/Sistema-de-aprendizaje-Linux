import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
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
import { promises as fs } from 'fs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.prisma.usuarios.findFirst({
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

        // 🖼️ Lee el archivo del avatar por defecto
        const base64 = await fs.readFile(
            'imagen.txt', // 👉 ajusta la ruta según tu proyecto
            'utf-8'
        );

        const DEFAULT_AVATAR = `data:image/svg+xml;base64,${base64.trim()}`;

        return this.prisma.usuarios.create({
            data: {
                username,
                correo,
                contraseña: hashed,
                avatar: DEFAULT_AVATAR, // or another appropriate number value for default avatar
            },
        });
    }
>>>>>>> Backend
}
