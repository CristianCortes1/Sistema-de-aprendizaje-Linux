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

  /**
   * Obtiene todas las lecciones con su estado de bloqueo para un usuario específico
   * Lógica:
   * - Lección 1 (id_Leccion = 1) siempre desbloqueada
   * - Lección N desbloqueada si existe progreso >= 100 en lección N-1
   */
  async findAllWithLockStatus(userId: number) {
    // Obtener todas las lecciones ordenadas por ID
    const lecciones = await this.prisma.lecciones.findMany({
      orderBy: { id_Leccion: 'asc' },
      select: {
        id_Leccion: true,
        Titulo: true,
      },
    });

    // Obtener todos los progresos del usuario
    const progresos = await this.prisma.progresos.findMany({
      where: { Usuarios_id_Usuario: userId },
      select: {
        Lecciones_id_Leccion: true,
        progreso: true,
      },
    });

    // Crear mapa de progreso por lección
    const progresoMap = new Map(
      progresos.map((p) => [p.Lecciones_id_Leccion, p.progreso]),
    );

    // Determinar estado de bloqueo para cada lección
    const leccionesConEstado = lecciones.map((leccion, index) => {
      let locked = false;
      let progreso = progresoMap.get(leccion.id_Leccion) || 0;

      // La primera lección siempre está desbloqueada
      if (index === 0) {
        locked = false;
      } else {
        // Lección N desbloqueada si la anterior (N-1) tiene progreso >= 100
        const leccionAnteriorId = lecciones[index - 1].id_Leccion;
        const progresoAnterior = progresoMap.get(leccionAnteriorId) || 0;
        locked = progresoAnterior < 100;
      }

      return {
        id: leccion.id_Leccion,
        titulo: leccion.Titulo,
        locked,
        progreso,
      };
    });

    return leccionesConEstado;
  }
}
