import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({
    description: 'Descripción del reto/desafío',
    example:
      'Lista todos los archivos del directorio actual mostrando detalles',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Retroalimentación para el usuario al completar el reto',
    example: 'Excelente! Has aprendido a usar el comando ls -la',
  })
  @IsOptional()
  @IsString()
  retroalimentacion?: string;

  @ApiProperty({
    description: 'ID de la lección a la que pertenece este reto',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  leccionId: number;
}
