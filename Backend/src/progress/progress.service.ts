import { Injectable } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  create(createProgressDto: CreateProgressDto) {
    return this.prisma.progresos.create({
      data: {
        progreso: createProgressDto.progress,
        Usuarios_id_Usuario: createProgressDto.userId,
        Lecciones_id_Leccion: createProgressDto.lessonId,
      },
    });
  }

  findAll() {
    return this.prisma.progresos.findMany();
  }

  findOne(id: number) {
    return this.prisma.progresos.findUnique({
      where: { id: id },
    });
    // return `This action returns a #${id} progress`;
  }

  update(id: number, updateProgressDto: UpdateProgressDto) {
    return this.prisma.progresos.update({
      where: { id: id },
      data: {
        progreso: updateProgressDto.progress,
        Usuarios_id_Usuario: updateProgressDto.userId,
        Lecciones_id_Leccion: updateProgressDto.lessonId,
      },
    });
    // return `This action updates a #${id} progress`;
  }

  remove(id: number) {
    return this.prisma.progresos.delete({
      where: { id: id },
    });
    // return `This action removes a #${id} progress`;
  }
}
