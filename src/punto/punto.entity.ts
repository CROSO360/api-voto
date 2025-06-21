// ==========================================
// IMPORTACIONES
// ==========================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Sesion } from 'src/sesion/sesion.entity';
import { Resolucion } from 'src/resolucion/resolucion.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { PuntoDocumento } from 'src/punto-documento/punto-documento.entity';

// ==========================================
// ENTIDAD: Punto
// ==========================================
@Entity()
export class Punto {
  @PrimaryGeneratedColumn()
  id_punto: number;

  // Relación con la sesión a la que pertenece el punto
  @ManyToOne(() => Sesion, sesion => sesion.puntos)
  @JoinColumn({ name: 'id_sesion' })
  sesion: Sesion;

  // ===========================
  // Datos principales
  // ===========================
  @Column()
  nombre: string;

  @Column()
  detalle: string;

  @Column({ type: 'int' })
  orden: number;

  @Column()
  es_administrativa: boolean;

  // ===========================
  // Resultados de votación
  // ===========================
  @Column()
  n_afavor: number;

  @Column({ type: 'float' })
  p_afavor: number;

  @Column()
  n_encontra: number;

  @Column({ type: 'float' })
  p_encontra: number;

  @Column()
  n_abstencion: number;

  @Column({ type: 'float' })
  p_abstencion: number;

  @Column()
  resultado: string;

  // ===========================
  // Control de estado
  // ===========================
  @Column()
  estado: boolean;

  @Column()
  status: boolean;

  // ===========================
  // Relaciones
  // ===========================
  @OneToMany(() => PuntoUsuario, puntoUsuario => puntoUsuario.punto)
  puntoUsuarios: PuntoUsuario[];

  @OneToMany(() => PuntoDocumento, puntoDocumento => puntoDocumento.punto)
  puntoDocumentos: PuntoDocumento[];

  @OneToOne(() => Resolucion, resolucion => resolucion.punto)
  resolucion: Resolucion;
}
