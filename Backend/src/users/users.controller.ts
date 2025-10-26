import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      example: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        rol: 'user',
        activo: false,
        experiencia: 0,
        monedas: 0,
        createdAt: '2025-10-24T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('ranking')
  @ApiOperation({
    summary: 'Obtener ranking de usuarios',
    description:
      'Obtiene la lista de usuarios ordenados por experiencia (de mayor a menor)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ranking obtenido exitosamente',
    schema: {
      example: [
        {
          id: 1,
          username: 'johndoe',
          experiencia: 1500,
          nivel: 5,
          avatar: 'https://example.com/avatar.png',
        },
        {
          id: 2,
          username: 'janedoe',
          experiencia: 1200,
          nivel: 4,
          avatar: 'https://example.com/avatar2.png',
        },
      ],
    },
  })
  getRanking() {
    return this.usersService.findAllForExperience();
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Obtiene la lista completa de usuarios registrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    schema: {
      example: [
        {
          id: 1,
          username: 'johndoe',
          email: 'johndoe@example.com',
          rol: 'user',
          activo: true,
          experiencia: 1500,
        },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Obtiene la información detallada de un usuario específico',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    schema: {
      example: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        rol: 'user',
        activo: true,
        experiencia: 1500,
        monedas: 500,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: 'Actualiza la información de un usuario existente',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        username: 'johndoe_updated',
        email: 'johndoe@example.com',
        updatedAt: '2025-10-24T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    schema: {
      example: {
        message: 'Usuario eliminado exitosamente',
        id: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
