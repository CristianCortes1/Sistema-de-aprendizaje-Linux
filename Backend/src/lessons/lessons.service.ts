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
    // Use a transaction to delete comandos -> retos -> leccion to ensure consistency
    return this.prisma.$transaction(async (prisma) => {
      // check existence
      const existing = await prisma.lecciones.findUnique({
        where: { id_Leccion: id },
      });
      if (!existing) {
        // Let Prisma throw a standard error or return null; here we throw to make behavior explicit
        throw new Error(`Lección con id ${id} no encontrada`);
      }

      // find retos for this leccion
      const retos = await prisma.retos.findMany({
        where: { Lecciones_id_Leccion: id },
      });

      // delete comandos for each reto
      const retoIds = retos.map((r) => r.id_Reto);
      if (retoIds.length) {
        await prisma.comandos.deleteMany({
          where: { Retos_id_Reto: { in: retoIds } },
        });
      }

      // delete retos
      await prisma.retos.deleteMany({ where: { Lecciones_id_Leccion: id } });

      // delete leccion
      const deleted = await prisma.lecciones.delete({
        where: { id_Leccion: id },
      });
      return deleted;
    });
  }
}
