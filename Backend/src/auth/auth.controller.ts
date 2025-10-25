import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description:
      'Crea una nueva cuenta de usuario y envía un email de confirmación',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description:
      'Usuario registrado exitosamente. Se ha enviado un email de confirmación.',
    schema: {
      example: {
        message:
          'Usuario registrado. Por favor, revisa tu correo para confirmar tu cuenta.',
        userId: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o usuario ya existe',
    schema: {
      example: {
        statusCode: 400,
        message: 'El usuario o correo ya existe',
        error: 'Bad Request',
      },
    },
  })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.correo, body.password);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'johndoe',
          email: 'johndoe@example.com',
          rol: 'user',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return this.authService.login(user);
  }

  @Get('confirm-email')
  @ApiOperation({
    summary: 'Confirmar email',
    description:
      'Confirma el email del usuario mediante el token enviado por correo',
  })
  @ApiQuery({
    name: 'token',
    description: 'Token de confirmación enviado por email',
    example: 'abc123def456',
  })
  @ApiResponse({
    status: 200,
    description: 'Email confirmado exitosamente',
    schema: {
      example: {
        message: 'Email confirmed successfully',
        user: {
          id: 1,
          username: 'johndoe',
          activo: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o expirado',
    schema: {
      example: {
        statusCode: 400,
        message: 'Token inválido o expirado',
        error: 'Bad Request',
      },
    },
  })
  async confirmEmail(@Query('token') token: string) {
    const user = await this.authService.confirmEmail(token);
    return {
      message: 'Email confirmed successfully',
      user,
    };
  }

}
