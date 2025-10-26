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
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear registro de progreso',
    description:
      'Crea un nuevo registro de progreso para un usuario en una lección específica',
  })
  @ApiResponse({
    status: 201,
    description: 'Progreso creado exitosamente',
    schema: {
      example: {
        id: 1,
        progress: 75,
        userId: 1,
        lessonId: 1,
        createdAt: '2025-10-24T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los registros de progreso',
    description: 'Obtiene todos los registros de progreso del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de progreso',
    schema: {
      example: [
        {
          id: 1,
          progress: 75,
          userId: 1,
          lessonId: 1,
          user: { username: 'johndoe' },
          lesson: { titulo: 'Comandos básicos' },
        },
      ],
    },
  })
  findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener progreso por ID',
    description: 'Obtiene un registro de progreso específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de progreso',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso encontrado',
    schema: {
      example: {
        id: 1,
        progress: 75,
        userId: 1,
        lessonId: 1,
        user: {
          id: 1,
          username: 'johndoe',
        },
        lesson: {
          id: 1,
          titulo: 'Comandos básicos',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Progreso no encontrado' })
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar progreso',
    description: 'Actualiza el porcentaje de progreso de un registro existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de progreso',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        progress: 100,
        userId: 1,
        lessonId: 1,
        updatedAt: '2025-10-24T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Progreso no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.update(+id, updateProgressDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar registro de progreso',
    description: 'Elimina un registro de progreso del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro de progreso',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Progreso eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Progreso no encontrado' })
  remove(@Param('id') id: string) {
    return this.progressService.remove(+id);
  }
}
