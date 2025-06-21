// =======================================================
// IMPORTACIONES
// =======================================================

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { Documento } from 'src/documento/documento.entity';
import { Sesion } from 'src/sesion/sesion.entity';

// =======================================================
// ENTIDAD: SesionDocumento
// =======================================================

@Entity()
export class SesionDocumento {
  @PrimaryGeneratedColumn()
  id_sesion_documento: number;

  @ManyToOne(() => Sesion, (sesion) => sesion.sesionDocumentos)
  @JoinColumn({ name: 'id_sesion' })
  sesion: Sesion;

  @ManyToOne(() => Documento, (documento) => documento.sesionDocumentos)
  @JoinColumn({ name: 'id_documento' })
  documento: Documento;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
}
