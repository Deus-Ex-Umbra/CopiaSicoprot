import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entidades/observacion.entidad';
import { Repository } from 'typeorm';
import { CrearObservacionDto } from './dto/crear-observacion.dto';
import { Documento } from '../documentos/entidades/documento.entidad';
import { Usuario } from '../usuarios/entidades/usuario.entidad';
import { ActualizarObservacionDto } from './dto/actualizar-observacion.dto';

@Injectable()
export class ObservacionesService {
  constructor(
    @InjectRepository(Observacion)
    private readonly repositorio_observacion: Repository<Observacion>,
    @InjectRepository(Documento)
    private readonly repositorio_documento: Repository<Documento>,
    @InjectRepository(Usuario)
    private readonly repositorio_usuario: Repository<Usuario>,
  ) {}

  async crear(id_documento: number, crearObservacionDto: CrearObservacionDto) {
    const { id_autor, ...datosObservacion } = crearObservacionDto;
    
    const documento = await this.repositorio_documento.findOneBy({ id: id_documento });
    if (!documento) {
      throw new NotFoundException(`Documento con ID '${id_documento}' no encontrado.`);
    }

    const autor = await this.repositorio_usuario.findOneBy({ id: id_autor });
    if (!autor) {
      throw new NotFoundException(`Usuario (autor) con ID '${id_autor}' no encontrado.`);
    }

    const nuevaObservacion = this.repositorio_observacion.create({
      ...datosObservacion,
      documento,
      autor,
    });

    return this.repositorio_observacion.save(nuevaObservacion);
  }

  async obtenerPorDocumento(id_documento: number) {
    return this.repositorio_observacion.find({
      where: { documento: { id: id_documento } },
      order: { fecha_creacion: 'DESC' },
    });
  }

  async actualizar(id: number, actualizarObservacionDto: ActualizarObservacionDto) {
    const observacion = await this.repositorio_observacion.preload({
      id: id,
      ...actualizarObservacionDto,
    });

    if (!observacion) {
      throw new NotFoundException(`Observación con ID '${id}' no encontrada.`);
    }

    return this.repositorio_observacion.save(observacion);
  }
}