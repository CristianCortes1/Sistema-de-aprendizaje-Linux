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
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva lección',
    description:
      'Crea una nueva lección de aprendizaje con sus retos y comandos asociados',
  })
  @ApiResponse({
    status: 201,
    description: 'Lección creada exitosamente',
    schema: {
      example: {
        id: 1,
        titulo: 'Comandos básicos de listado',
        retos: [
          {
            id: 1,
            descripcion: 'Lista archivos del directorio',
            comandos: [{ id: 1, comando: 'ls' }],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las lecciones',
    description: 'Obtiene la lista completa de lecciones disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de lecciones',
    schema: {
      example: [
        {
          id: 1,
          titulo: 'Comandos básicos de listado',
          retos: [],
        },
        {
          id: 2,
          titulo: 'Navegación en directorios',
          retos: [],
        },
      ],
    },
  })
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener lección por ID',
    description:
      'Obtiene una lección específica con todos sus retos y comandos',
  })
  @ApiParam({ name: 'id', description: 'ID de la lección', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lección encontrada',
    schema: {
      example: {
        id: 1,
        titulo: 'Comandos básicos de listado',
        retos: [
          {
            id: 1,
            descripcion: 'Lista todos los archivos',
            Retroalimentacion: 'Excelente!',
            comandos: [
              { id: 1, comando: 'ls' },
              { id: 2, comando: 'ls -l' },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Lección no encontrada' })
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar lección',
    description: 'Actualiza la información de una lección existente',
  })
  @ApiParam({ name: 'id', description: 'ID de la lección', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lección actualizada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Lección no encontrada' })
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(+id, updateLessonDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar lección',
    description: 'Elimina una lección del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID de la lección', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lección eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Lección no encontrada' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(+id);
  }
}
