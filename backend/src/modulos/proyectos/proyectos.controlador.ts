import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProyectosService } from './proyectos.servicio';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly servicio_proyectos: ProyectosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Estudiante o Asesor no encontrado.' })
  crear(@Body() crear_proyecto_dto: CrearProyectoDto) {
    return this.servicio_proyectos.crear(crear_proyecto_dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por su ID' })
  @ApiParam({ name: 'id', description: 'ID numérico del proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado.' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado.' })
  obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.servicio_proyectos.obtenerUno(id);
  }
}