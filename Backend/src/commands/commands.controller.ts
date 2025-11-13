import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('commands')
@ApiBearerAuth()
@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Crear nuevo comando',
    description: 'Crea un nuevo comando Linux y lo asocia a un reto',
  })
  @ApiResponse({
    status: 201,
    description: 'Comando creado exitosamente',
    schema: {
      example: {
        id: 1,
        comando: 'ls -la',
        descripcion: 'Lista archivos incluidos ocultos con detalles',
        retoId: 1,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createCommandDto: CreateCommandDto) {
    return this.commandsService.create(createCommandDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todos los comandos',
    description: 'Obtiene la lista completa de comandos Linux registrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comandos',
    schema: {
      example: [
        {
          id: 1,
          comando: 'ls -la',
          descripcion: 'Lista archivos con detalles',
          retoId: 1,
          reto: {
            descripcion: 'Lista archivos con detalles',
          },
        },
        {
          id: 2,
          comando: 'cd /home',
          descripcion: 'Cambia al directorio home',
          retoId: 2,
          reto: {
            descripcion: 'Navega al directorio home',
          },
        },
      ],
    },
  })
  findAll() {
    return this.commandsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Obtener comando por ID',
    description: 'Obtiene un comando específico con su información detallada',
  })
  @ApiParam({ name: 'id', description: 'ID del comando', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Comando encontrado',
    schema: {
      example: {
        id: 1,
        comando: 'ls -la',
        descripcion: 'Lista todos los archivos con detalles',
        retoId: 1,
        reto: {
          id: 1,
          descripcion: 'Lista todos los archivos con detalles',
          leccionId: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Comando no encontrado' })
  findOne(@Param('id') id: string) {
    return this.commandsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Actualizar comando',
    description: 'Actualiza la información de un comando existente',
  })
  @ApiParam({ name: 'id', description: 'ID del comando', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Comando actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        comando: 'ls -lah',
        descripcion: 'Lista archivos con unidades legibles',
        retoId: 1,
        updatedAt: '2025-10-24T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Comando no encontrado' })
  update(@Param('id') id: string, @Body() updateCommandDto: UpdateCommandDto) {
    return this.commandsService.update(+id, updateCommandDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Eliminar comando',
    description: 'Elimina un comando del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID del comando', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Comando eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Comando no encontrado' })
  remove(@Param('id') id: string) {
    return this.commandsService.remove(+id);
  }
}
