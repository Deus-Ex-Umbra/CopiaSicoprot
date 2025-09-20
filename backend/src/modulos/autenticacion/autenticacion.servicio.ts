import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.servicio';
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { RegistroDto } from './dto/registro.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entidades/usuario.entidad';
import { Repository } from 'typeorm';
import { Rol } from '../usuarios/enums/rol.enum';
import { Estudiante } from '../estudiantes/entidades/estudiante.entidad';
import { Asesor } from '../asesores/entidades/asesor.entidad';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly servicio_usuarios: UsuariosService,
    @InjectRepository(Usuario)
    private readonly repositorio_usuario: Repository<Usuario>,
    @InjectRepository(Estudiante)
    private readonly repositorio_estudiante: Repository<Estudiante>,
    @InjectRepository(Asesor)
    private readonly repositorio_asesor: Repository<Asesor>,
  ) {}

  async iniciarSesion(iniciar_sesion_dto: IniciarSesionDto) {
    const { correo, contrasena } = iniciar_sesion_dto;
    const usuario = await this.servicio_usuarios.buscarPorCorreo(correo);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const es_contrasena_valida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!es_contrasena_valida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { contrasena: _, ...datos_usuario } = usuario;

    return {
      message: 'Inicio de sesión exitoso',
      usuario: datos_usuario,
    };
  }

  async registrarse(registro_dto: RegistroDto) {
    const { contrasena, rol, correo, nombre, apellido } = registro_dto;

    try {
      const nuevo_usuario = this.repositorio_usuario.create({
        correo,
        rol,
        contrasena: await bcrypt.hash(contrasena, 10),
      });

      const usuario_guardado = await this.repositorio_usuario.save(nuevo_usuario);

      if (rol === Rol.Estudiante) {
        const nuevo_estudiante = this.repositorio_estudiante.create({
          nombre,
          apellido,
          usuario: usuario_guardado,
        });
        await this.repositorio_estudiante.save(nuevo_estudiante);
      } else if (rol === Rol.Asesor) {
        const nuevo_asesor = this.repositorio_asesor.create({
          nombre,
          apellido,
          usuario: usuario_guardado,
        });
        await this.repositorio_asesor.save(nuevo_asesor);
      }

      const { contrasena: _, ...usuario_para_retornar } = usuario_guardado;
      return usuario_para_retornar;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El correo ya está en uso.');
      }
      throw error;
    }
  }

  cerrarSesion() {
    return { message: 'Sesión cerrada exitosamente.' };
  }
}