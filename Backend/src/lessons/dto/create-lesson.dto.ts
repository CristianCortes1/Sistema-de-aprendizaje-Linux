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
  @ApiPropertyOptional({
    description: 'Tipo de contenido: "reto" (con terminal) o "explicacion" (solo lectura)',
    example: 'reto',
    enum: ['reto', 'explicacion'],
    default: 'reto',
  })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({
    description: 'Descripción del reto o título de la explicación',
    example: 'Lista todos los archivos incluyendo los ocultos',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Contenido extenso para explicaciones (HTML/Markdown). Solo para tipo="explicacion"',
    example: '<h2>El comando ls</h2><p>El comando ls lista archivos...</p>',
  })
  @IsOptional()
  @IsString()
  contenido?: string;

  @ApiPropertyOptional({
    description: 'Retroalimentación para el usuario (solo para tipo="reto")',
    example: 'Bien hecho! El flag -a muestra archivos ocultos',
  })
  @IsOptional()
  @IsString()
  Retroalimentacion?: string;

  @ApiPropertyOptional({
    description: 'Lista de comandos válidos como solución (solo para tipo="reto")',
    type: [CreateComandoDto],
    example: [{ comando: 'ls -la' }, { comando: 'ls -al' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComandoDto)
  comandos?: CreateComandoDto[];
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
