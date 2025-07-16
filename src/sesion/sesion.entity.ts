// ==============================
// Importaciones
// ==============================

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Punto } from 'src/punto/punto.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
import { Grupo } from 'src/grupo/grupo.entity';

// ==============================
// Entidad: Sesion
// ==============================

@Entity()
export class Sesion {
  // ===========================
  // Atributos básicos
  // ===========================

  @PrimaryGeneratedColumn()
  id_sesion: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  fecha_inicio: Date;

  @Column()
  fecha_fin: Date;

  @Column()
  tipo: string; // 'ordinaria' | 'extraordinaria'

  @Column()
  fase: string; // 'pendiente' | 'en curso' | 'finalizada'

  @Column()
  estado: boolean; // Control de edición/eliminación

  @Column()
  status: boolean; // Activa/inactiva en términos funcionales

  // ===========================
  // Relaciones
  // ===========================

  /**
   * Puntos del orden del día asociados a la sesión.
   */
  @OneToMany(() => Punto, punto => punto.sesion)
  puntos: Punto[];

  @OneToMany(() => Grupo, grupo => grupo.sesion)
  grupos: Grupo[];

  /**
   * Asistencias registradas para esta sesión.
   */
  @OneToMany(() => Asistencia, asistencia => asistencia.sesion)
  asistencias: Asistencia[];

  /**
   * Documentos vinculados a esta sesión (ej. reporte PDF).
   */
  @OneToMany(() => SesionDocumento, sesionDocumento => sesionDocumento.sesion)
  sesionDocumentos: SesionDocumento[];
}

