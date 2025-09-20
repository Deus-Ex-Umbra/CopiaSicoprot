import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entidades/proyecto.endidad';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';
import { UsuariosService } from '../usuarios/usuarios.servicio';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly repositorio_proyecto: Repository<Proyecto>,
    private readonly servicio_usuarios: UsuariosService,
  ) {}

  async crear(crear_proyecto_dto: CrearProyectoDto) {
    const { id_estudiante, id_asesor, titulo } = crear_proyecto_dto;
    const estudiante = await this.servicio_usuarios.obtenerUno(id_estudiante);
    const asesor = await this.servicio_usuarios.obtenerUno(id_asesor);

    const nuevo_proyecto = this.repositorio_proyecto.create({
      titulo,
      estudiante,
      asesor,
    });

    return this.repositorio_proyecto.save(nuevo_proyecto);
  }

  async obtenerUno(id: number) {
    const proyecto = await this.repositorio_proyecto.findOneBy({ id });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID '${id}' no encontrado.`);
    }
    return proyecto;
  }
}