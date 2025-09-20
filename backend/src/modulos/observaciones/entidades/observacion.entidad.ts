import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Documento } from '../../documentos/entidades/documento.entidad';
import { Asesor } from '../../asesores/entidades/asesor.entidad';
import { EstadoObservacion } from '../enums/estado-observacion.enum';

@Entity('observaciones')
export class Observacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  contenido: string;
  
  @Column({ type: 'enum', enum: EstadoObservacion, default: EstadoObservacion.Pendiente })
  estado: EstadoObservacion;
  
  @Column({ type: 'int', nullable: true })
  pagina: number;

  @Column({ type: 'float', nullable: true })
  posicion_x: number;

  @Column({ type: 'float', nullable: true })
  posicion_y: number;

  @Column({ type: 'float', nullable: true })
  ancho: number;

  @Column({ type: 'float', nullable: true })
  alto: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion: Date;

  @ManyToOne(() => Documento, (documento) => documento.observaciones)
  documento: Documento;

  @ManyToOne(() => Asesor, (asesor) => asesor.observaciones_realizadas, { eager: true })
  autor: Asesor;
}