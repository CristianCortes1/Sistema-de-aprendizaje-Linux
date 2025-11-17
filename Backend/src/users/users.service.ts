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
      where: {
        rol: { not: 'admin' }, // Excluir usuarios con rol admin
      },
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

  async remove(id: number) {
    // Usar una transacción para eliminar todo en orden correcto
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar que el usuario existe
      const user = await tx.user.findUnique({
        where: { id_Usuario: id },
      });

      if (!user) {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }

      // 2. Eliminar progresos del usuario (tabla Progresos)
      await tx.progresos.deleteMany({
        where: { Usuarios_id_Usuario: id },
      });

      // 3. Eliminar cualquier otro registro relacionado que pueda existir
      // (Aquí puedes agregar otras tablas cuando las implementes)

      // 4. Finalmente eliminar el usuario
      const deletedUser = await tx.user.delete({
        where: { id_Usuario: id },
      });

      return {
        message: 'Usuario y todos sus datos relacionados eliminados exitosamente',
        id: deletedUser.id_Usuario,
        username: deletedUser.username,
      };
    });
  }
}
