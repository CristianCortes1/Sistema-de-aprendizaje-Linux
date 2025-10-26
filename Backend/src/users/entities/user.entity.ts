import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre de usuario', example: 'johndoe' })
  username: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({ description: 'Contraseña encriptada' })
  password: string;

  @ApiPropertyOptional({
    description: 'URL del avatar',
    example: 'https://example.com/avatar.png',
  })
  avatar?: string;

  @ApiProperty({
    description: 'Racha de días consecutivos',
    example: 5,
    default: 0,
  })
  racha: number;

  @ApiProperty({
    description: 'Puntos de experiencia',
    example: 1500,
    default: 0,
  })
  experience: number;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    example: 'user',
    default: 'user',
  })
  rol?: string;

  @ApiProperty({
    description: 'Estado de activación de la cuenta',
    example: true,
    default: false,
  })
  activo: boolean;

  @ApiPropertyOptional({
    description: 'Monedas del juego',
    example: 500,
    default: 0,
  })
  monedas?: number;

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

  @ApiPropertyOptional({
    description: 'Fecha de último login',
    example: '2025-10-24T00:00:00.000Z',
  })
  ultimoLogin?: Date;
}
