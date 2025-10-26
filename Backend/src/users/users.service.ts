import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        correo: createUserDto.email,
        contraseña: createUserDto.password,
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id_Usuario: id },
      data: {
        username: updateUserDto.username,
        correo: updateUserDto.email,
        contraseña: updateUserDto.password,
        avatar: updateUserDto.avatar,
        rol: updateUserDto.rol,
        activo: updateUserDto.activo,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id_Usuario: id },
    });
  }
}
