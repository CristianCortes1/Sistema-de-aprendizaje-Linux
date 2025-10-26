import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class CreateProgressDto {
  @ApiProperty({
    description: 'Porcentaje de progreso (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID de la lección',
    example: 1,
  })
  @IsInt()
  lessonId: number;
}
