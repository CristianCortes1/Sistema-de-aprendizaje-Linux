import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateComandoDto {
  @ApiProperty({
    description: 'Comando Linux esperado como solución',
    example: 'ls -la',
  })
  @IsString()
  @IsNotEmpty()
  comando: string;
}

export class CreateRetoDto {
  @ApiProperty({
    description: 'Descripción del reto',
    example: 'Lista todos los archivos incluyendo los ocultos',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Retroalimentación para el usuario',
    example: 'Bien hecho! El flag -a muestra archivos ocultos',
  })
  @IsOptional()
  @IsString()
  Retroalimentacion?: string;

  @ApiProperty({
    description: 'Lista de comandos válidos como solución',
    type: [CreateComandoDto],
    example: [{ comando: 'ls -la' }, { comando: 'ls -al' }],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateComandoDto)
  comandos: CreateComandoDto[];
}

export class CreateLessonDto {
  @ApiProperty({
    description: 'Título de la lección',
    example: 'Comandos básicos de listado',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    description: 'Lista de retos que componen la lección',
    type: [CreateRetoDto],
    example: [
      {
        descripcion: 'Lista archivos del directorio actual',
        Retroalimentacion: 'Excelente!',
        comandos: [{ comando: 'ls' }],
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRetoDto)
  retos: CreateRetoDto[];
}
