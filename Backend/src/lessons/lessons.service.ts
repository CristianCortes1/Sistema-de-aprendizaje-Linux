import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LessonsService {

  constructor(private prisma: PrismaService) {}

  create(createLessonDto: CreateLessonDto) {
    return this.prisma.lecciones.create({
      data: {
        Titulo: createLessonDto.titulo,
      },
    });
  }

  findAll() {
    return this.prisma.lecciones.findMany();
  }

  findOne(id: number) {
    return this.prisma.lecciones.findUnique({
      where: { id_Leccion: id },
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
