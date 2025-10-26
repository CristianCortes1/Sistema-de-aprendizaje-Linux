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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo item',
    description: 'Crea un nuevo item para el sistema de gamificación',
  })
  @ApiResponse({
    status: 201,
    description: 'Item creado exitosamente',
    schema: {
      example: {
        id: 1,
        nombre: 'Espada de acero',
        descripcion: 'Una espada forjada con acero templado',
        precio: 100,
        imagenUrl: 'https://example.com/sword.png',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los items',
    description: 'Obtiene la lista completa de items disponibles en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de items',
    schema: {
      example: [
        {
          id: 1,
          nombre: 'Espada de acero',
          precio: 100,
          imagenUrl: 'https://example.com/sword.png',
        },
        {
          id: 2,
          nombre: 'Escudo de bronce',
          precio: 75,
          imagenUrl: 'https://example.com/shield.png',
        },
      ],
    },
  })
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener item por ID',
    description: 'Obtiene un item específico con su información detallada',
  })
  @ApiParam({ name: 'id', description: 'ID del item', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado',
    schema: {
      example: {
        id: 1,
        nombre: 'Espada de acero',
        descripcion: 'Una espada forjada con acero templado',
        precio: 100,
        imagenUrl: 'https://example.com/sword.png',
        createdAt: '2025-10-24T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar item',
    description: 'Actualiza la información de un item existente',
  })
  @ApiParam({ name: 'id', description: 'ID del item', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Item actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        nombre: 'Espada de acero mejorada',
        precio: 150,
        updatedAt: '2025-10-24T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar item',
    description: 'Elimina un item del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID del item', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Item eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
