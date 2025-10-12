import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChallengesService {

  constructor(private prisma: PrismaService) {}

  create(createChallengeDto: CreateChallengeDto) {
    return this.prisma.retos.create({
      data: {
        descripcion: createChallengeDto.descripcion,
        Retroalimentacion: createChallengeDto.retroalimentacion,
        Lecciones_id_Leccion: createChallengeDto.leccionId,
      },
    });
    // return 'This action adds a new challenge';
  }

  findAll() {
    return this.prisma.retos.findMany();
  }

  findOne(id: number) {
    return this.prisma.retos.findUnique({
      where: { id_Reto: id },
    });
    // return `This action returns a #${id} challenge`;
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return this.prisma.retos.update({
      where: { id_Reto: id },
      data: {
        descripcion: updateChallengeDto.descripcion,
        Retroalimentacion: updateChallengeDto.retroalimentacion,
        Lecciones_id_Leccion: updateChallengeDto.leccionId,
      },
    });
    // return `This action updates a #${id} challenge`;
  }

  remove(id: number) {
    return this.prisma.retos.delete({
      where: { id_Reto: id },
    });
    // return `This action removes a #${id} challenge`;
  }
}
