import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, MaxLength } from 'class-validator';

export class CreateCommandDto {
  @ApiProperty({
    description: 'Comando Linux',
    example: 'ls -la',
  })
  @IsString()
  @IsNotEmpty()
  comando: string;

  @ApiPropertyOptional({
    description: 'Descripción corta del comando para la biblioteca',
    example: 'Lista archivos incluidos ocultos con detalles',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @ApiProperty({
    description: 'ID del reto al que pertenece este comando',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  retoId: number;
}
