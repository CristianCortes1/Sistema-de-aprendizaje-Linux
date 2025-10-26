import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommandDto {
  @ApiProperty({
    description: 'Comando Linux',
    example: 'ls -la',
  })
  @IsString()
  @IsNotEmpty()
  comando: string;

  @ApiProperty({
    description: 'ID del reto al que pertenece este comando',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  retoId: number;
}
