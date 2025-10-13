import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LessonsService {

  constructor(private prisma: PrismaService) {}

  create(createLessonDto: CreateLessonDto) {
    // Build nested create data for retos and comandos
    const retosData = createLessonDto.retos.map((reto) => ({
      descripcion: reto.descripcion,
      Retroalimentacion: reto.Retroalimentacion ?? null,
      comandos: {
        create: reto.comandos.map((c) => ({ comando: c.comando })),
      },
    }));

    return this.prisma.lecciones.create({
      data: {
        Titulo: createLessonDto.titulo,
        retos: {
          create: retosData,
        },
      },
      include: {
        retos: {
          include: { comandos: true },
        },
      },
    });
  }

  findAll() {
    return this.prisma.lecciones.findMany({
      include: {
        retos: {
          include: { comandos: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.lecciones.findUnique({
      where: { id_Leccion: id },
      include: {
        retos: {
          include: { comandos: true },
        },
      },
    });
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return this.prisma.lecciones.update({
      where: { id_Leccion: id },
      data: {
        Titulo: updateLessonDto.titulo,
      },
    });
  }

  remove(id: number) {
    return this.prisma.lecciones.delete({
      where: { id_Leccion: id },
    });
  }
}
