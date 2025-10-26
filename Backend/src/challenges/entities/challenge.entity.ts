import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Challenge {
  @ApiProperty({ description: 'ID único del reto', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Descripción del reto',
    example: 'Lista todos los archivos del directorio',
  })
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Retroalimentación al completar',
    example: 'Excelente trabajo!',
  })
  retroalimentacion?: string;

  @ApiProperty({ description: 'ID de la lección asociada', example: 1 })
  leccionId: number;

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
