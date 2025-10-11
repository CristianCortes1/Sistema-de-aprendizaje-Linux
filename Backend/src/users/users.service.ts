import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.usuarios.create({
      data: {
        username: createUserDto.username,
        correo: createUserDto.email,
        contraseña: createUserDto.password,
        avatar: createUserDto.avatar,
      },
    });
  }

  findAll() {
    return this.prisma.usuarios.findMany();
  }

  findOne(id: number) {
    return this.prisma.usuarios.findUnique({
      where: { id_Usuario: id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.usuarios.update({
      where: { id_Usuario: id },
      data: {
        username: updateUserDto.username,
        correo: updateUserDto.email,
        contraseña: updateUserDto.password,
        avatar: updateUserDto.avatar,
      },
    });
  }

  remove(id: number) {
    return this.prisma.usuarios.delete({
      where: { id_Usuario: id },
    });
  }
}
