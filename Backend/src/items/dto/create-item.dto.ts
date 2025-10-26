import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'Nombre del item',
    example: 'Espada de acero',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del item',
    example: 'Una espada forjada con acero templado',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Precio del item en monedas del juego',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  precio?: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen del item',
    example: 'https://example.com/sword.png',
  })
  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
