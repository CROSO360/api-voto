// =======================================================
// IMPORTACIONES
// =======================================================

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
import { PuntoDocumento } from 'src/punto-documento/punto-documento.entity';

// =======================================================
// ENTIDAD: Documento
// Representa un archivo cargado al sistema
// =======================================================

@Entity()
export class Documento {
  @PrimaryGeneratedColumn()
  id_documento: number;

  @Column()
  nombre: string;

  @Column()
  url: string;

  @Column()
  fecha_subida: Date;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;

  // =============================
  // RELACIONES
  // =============================

  // Relación con documentos asociados a sesiones
  @OneToMany(() => SesionDocumento, (sesionDocumento) => sesionDocumento.sesion)
  sesionDocumentos: SesionDocumento[];

  // Relación con documentos asociados a puntos
  @OneToMany(() => PuntoDocumento, (puntoDocumento) => puntoDocumento.punto)
  puntoDocumentos: PuntoDocumento[];
}
