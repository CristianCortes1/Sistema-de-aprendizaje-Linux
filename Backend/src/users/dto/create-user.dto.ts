import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'johndoe',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'URL del avatar del usuario',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario en el sistema',
    example: 'user',
    default: 'user',
    enum: ['user', 'admin', 'moderator'],
  })
  @IsOptional()
  @IsString()
  rol?: string;

  @ApiPropertyOptional({
    description: 'Estado de activación de la cuenta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
