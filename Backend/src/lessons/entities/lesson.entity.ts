import { ApiProperty } from '@nestjs/swagger';

export class Lesson {
  @ApiProperty({ description: 'ID único de la lección', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Título de la lección',
    example: 'Comandos básicos de listado',
  })
  titulo: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-10-24T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-10-24T00:00:00.000Z',
  })
  updatedAt: Date;
}
