import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
<<<<<<< HEAD

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
=======
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

  findAllForExperience() {
    return this.prisma.usuarios.findMany({
      orderBy: { experiencia: 'desc' },
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
        rol: updateUserDto.rol,
      },
    });
  }

  remove(id: number) {
    return this.prisma.usuarios.delete({
      where: { id_Usuario: id },
    });
>>>>>>> Backend
  }
}
