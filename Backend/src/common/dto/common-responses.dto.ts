import { ApiProperty } from '@nestjs/swagger';

/**
 * Respuesta estándar para operaciones exitosas
 */
export class SuccessResponseDto {
  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'Operación completada exitosamente',
  })
  message: string;

  @ApiProperty({ description: 'Datos de la respuesta', required: false })
  data?: any;
}

/**
 * Respuesta de error estándar
 */
export class ErrorResponseDto {
  @ApiProperty({ description: 'Código de estado HTTP', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'Mensaje de error', example: 'Datos inválidos' })
  message: string;

  @ApiProperty({ description: 'Tipo de error', example: 'Bad Request' })
  error: string;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2025-10-24T00:00:00.000Z',
    required: false,
  })
  timestamp?: string;

  @ApiProperty({
    description: 'Ruta de la petición',
    example: '/api/users',
    required: false,
  })
  path?: string;
}

/**
 * Respuesta de login
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiam9obmRvZSIsImlhdCI6MTYzMjQ4MjQwMCwiZXhwIjoxNjMyNDg2MDAwfQ.abc123def456',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    example: {
      id: 1,
      username: 'johndoe',
      email: 'johndoe@example.com',
      rol: 'user',
    },
  })
  user: {
    id: number;
    username: string;
    email: string;
    rol: string;
  };
}

/**
 * Respuesta de registro
 */
export class RegisterResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example:
      'Usuario registrado. Por favor, revisa tu correo para confirmar tu cuenta.',
  })
  message: string;

  @ApiProperty({ description: 'ID del usuario creado', example: 1 })
  userId: number;
}

/**
 * Respuesta de confirmación de email
 */
export class ConfirmEmailResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Email confirmed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Usuario confirmado',
    example: {
      id: 1,
      username: 'johndoe',
      activo: true,
    },
  })
  user: {
    id: number;
    username: string;
    activo: boolean;
  };
}

/**
 * Respuesta de ranking de usuarios
 */
export class RankingItemDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre de usuario', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'Puntos de experiencia', example: 1500 })
  experiencia: number;

  @ApiProperty({ description: 'Nivel del usuario', example: 5 })
  nivel?: number;

  @ApiProperty({
    description: 'URL del avatar',
    example: 'https://example.com/avatar.png',
    required: false,
  })
  avatar?: string;

  @ApiProperty({ description: 'Posición en el ranking', example: 1 })
  posicion?: number;
}

/**
 * DTO para paginación
 */
export class PaginationDto {
  @ApiProperty({ description: 'Número de página', example: 1, default: 1 })
  page: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
    default: 10,
  })
  limit: number;

  @ApiProperty({ description: 'Total de elementos', example: 100 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 10 })
  totalPages: number;
}

/**
 * Respuesta paginada genérica
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Datos de la página actual', isArray: true })
  data: T[];

  @ApiProperty({
    description: 'Información de paginación',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
