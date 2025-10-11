import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
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
        return this.prisma.usuarios.create({
            data: {
                username,
                correo,
                contraseña: hashed,
            },
        });
    }
}
