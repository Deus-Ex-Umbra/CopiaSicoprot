import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ObservacionesService } from './observaciones.servicio';
import { CrearObservacionDto } from './dto/crear-observacion.dto';
import { ActualizarObservacionDto } from './dto/actualizar-observacion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('observaciones')
@Controller('observaciones')
export class ObservacionesController {
  constructor(private readonly servicio_observaciones: ObservacionesService) {}

  @Post(':documentoId/crear')
  @ApiOperation({ summary: 'Crear una nueva observación para un documento' })
  @ApiParam({ name: 'documentoId', description: 'ID numérico del documento a comentar' })
  @ApiResponse({ status: 201, description: 'Observación creada exitosamente.' })
  @ApiResponse({ status: 404, description: 'El documento o el autor no fueron encontrados.' })
  crear(
    @Param('documentoId', ParseIntPipe) documentoId: number,
    @Body() crearObservacionDto: CrearObservacionDto,
  ) {
    return this.servicio_observaciones.crear(documentoId, crearObservacionDto);
  }

  @Get('por-documento/:documentoId')
  @ApiOperation({ summary: 'Obtener todas las observaciones de un documento' })
  @ApiParam({ name: 'documentoId', description: 'ID numérico del documento' })
  @ApiResponse({ status: 200, description: 'Lista de observaciones del documento.' })
  obtenerPorDocumento(@Param('documentoId', ParseIntPipe) documentoId: number) {
    return this.servicio_observaciones.obtenerPorDocumento(documentoId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el estado de una observación' })
  @ApiParam({ name: 'id', description: 'ID numérico de la observación a actualizar' })
  @ApiResponse({ status: 200, description: 'Estado de la observación actualizado.' })
  @ApiResponse({ status: 404, description: 'Observación no encontrada.' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarObservacionDto: ActualizarObservacionDto,
  ) {
    return this.servicio_observaciones.actualizar(id, actualizarObservacionDto);
  }
}