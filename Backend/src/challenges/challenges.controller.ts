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
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('challenges')
@ApiBearerAuth()
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Crear nuevo reto',
    description: 'Crea un nuevo reto/desafío y lo asocia a una lección',
  })
  @ApiResponse({
    status: 201,
    description: 'Reto creado exitosamente',
    schema: {
      example: {
        id: 1,
        descripcion: 'Lista todos los archivos del directorio actual',
        retroalimentacion: 'Excelente! Has aprendido a listar archivos',
        leccionId: 1,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todos los retos',
    description: 'Obtiene la lista completa de retos/desafíos disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de retos',
    schema: {
      example: [
        {
          id: 1,
          descripcion: 'Lista archivos con detalles',
          retroalimentacion: 'Bien hecho!',
          leccionId: 1,
        },
        {
          id: 2,
          descripcion: 'Navega al directorio home',
          retroalimentacion: 'Perfecto!',
          leccionId: 2,
        },
      ],
    },
  })
  findAll() {
    return this.challengesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Obtener reto por ID',
    description: 'Obtiene un reto específico con su información detallada',
  })
  @ApiParam({ name: 'id', description: 'ID del reto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reto encontrado',
    schema: {
      example: {
        id: 1,
        descripcion: 'Lista todos los archivos incluyendo ocultos',
        retroalimentacion: 'Excelente! El flag -a muestra archivos ocultos',
        leccionId: 1,
        leccion: {
          id: 1,
          titulo: 'Comandos básicos',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Actualizar reto',
    description: 'Actualiza la información de un reto existente',
  })
  @ApiParam({ name: 'id', description: 'ID del reto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.challengesService.update(+id, updateChallengeDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Eliminar reto',
    description: 'Elimina un reto del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID del reto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reto eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  remove(@Param('id') id: string) {
    return this.challengesService.remove(+id);
  }
}
