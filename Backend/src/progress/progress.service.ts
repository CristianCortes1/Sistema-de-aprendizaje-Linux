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

  async createOrUpdate(createProgressDto: CreateProgressDto) {
    // Buscar si ya existe un progreso para este usuario y lección
    const existing = await this.prisma.progresos.findFirst({
      where: {
        Usuarios_id_Usuario: createProgressDto.userId,
        Lecciones_id_Leccion: createProgressDto.lessonId,
      },
    });

    const wasCompleted = existing && existing.progreso >= 100;
    const isNowCompleted = createProgressDto.progress >= 100;

    if (existing) {
      // Si existe, actualizar solo si el nuevo progreso es mayor
      if (createProgressDto.progress > existing.progreso) {
        const updated = await this.prisma.progresos.update({
          where: { id: existing.id },
          data: {
            progreso: createProgressDto.progress,
          },
        });

        // Si la lección acaba de completarse (no estaba completada antes)
        if (!wasCompleted && isNowCompleted) {
          await this.grantXPForLesson(
            createProgressDto.userId,
            createProgressDto.lessonId,
          );
        }

        return updated;
      }
      // Si el progreso es menor o igual, devolver el existente
      return existing;
    } else {
      // Si no existe, crear uno nuevo
      const created = await this.prisma.progresos.create({
        data: {
          progreso: createProgressDto.progress,
          Usuarios_id_Usuario: createProgressDto.userId,
          Lecciones_id_Leccion: createProgressDto.lessonId,
        },
      });

      // Si se completó en el primer intento
      if (isNowCompleted) {
        await this.grantXPForLesson(
          createProgressDto.userId,
          createProgressDto.lessonId,
        );
      }

      return created;
    }
  }

  /**
   * Otorga XP al usuario por completar una lección
   */
  private async grantXPForLesson(userId: number, lessonId: number) {
    // Obtener la lección para saber cuánto XP otorga
    const leccion = await this.prisma.lecciones.findUnique({
      where: { id_Leccion: lessonId },
      select: { experiencia: true },
    });

    if (!leccion) {
      console.error(`Lección ${lessonId} no encontrada`);
      return;
    }

    // Actualizar la experiencia del usuario
    await this.prisma.user.update({
      where: { id_Usuario: userId },
      data: {
        experiencia: {
          increment: leccion.experiencia,
        },
      },
    });

    console.log(
      `✨ Usuario ${userId} ganó ${leccion.experiencia} XP por completar la lección ${lessonId}`,
    );
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
