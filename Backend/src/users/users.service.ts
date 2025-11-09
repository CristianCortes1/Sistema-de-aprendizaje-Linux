import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
  
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        correo: createUserDto.email,
        contraseña: hashedPassword,
        avatar: createUserDto.avatar,
        rol: createUserDto.rol,
        activo: createUserDto.activo,
      },
    });
  }

  findAllForExperience() {
    return this.prisma.user.findMany({
      orderBy: { experiencia: 'desc' },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id_Usuario: id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data: any = {
      username: updateUserDto.username,
      correo: updateUserDto.email,
      avatar: updateUserDto.avatar,
      rol: updateUserDto.rol,
      activo: updateUserDto.activo,
    };

    if (updateUserDto.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
      data.contraseña = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    return this.prisma.user.update({
      where: { id_Usuario: id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id_Usuario: id },
    });
  }
}
