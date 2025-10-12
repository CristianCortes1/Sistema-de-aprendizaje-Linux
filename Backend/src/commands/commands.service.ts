import { Injectable } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommandsService {

  constructor(private prisma: PrismaService) {}

  create(createCommandDto: CreateCommandDto) {
    return this.prisma.comandos.create({
      data: {
        comando: createCommandDto.comando,
        Retos_id_Reto: createCommandDto.retoId,
      },
    });
  }

  findAll() {
    return this.prisma.comandos.findMany();
  }

  findOne(id: number) {
    return this.prisma.comandos.findUnique({
      where: { id_Comando: id },
    });
  }

  update(id: number, updateCommandDto: UpdateCommandDto) {
    return this.prisma.comandos.update({
      where: { id_Comando: id },
      data: {
        comando: updateCommandDto.comando,
        Retos_id_Reto: updateCommandDto.retoId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.comandos.delete({
      where: { id_Comando: id },
    });
  }
}
