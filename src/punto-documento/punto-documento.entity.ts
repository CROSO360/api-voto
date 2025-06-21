// =======================================================
// IMPORTACIONES
// =======================================================

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { Punto } from 'src/punto/punto.entity';
import { Documento } from 'src/documento/documento.entity';

// =======================================================
// ENTIDAD: PuntoDocumento
// Relaciona un documento con un punto específico de sesión
// =======================================================

@Entity()
export class PuntoDocumento {
  @PrimaryGeneratedColumn()
  id_punto_documento: number;

  // Relación con el punto al que pertenece este documento
  @ManyToOne(() => Punto, (punto) => punto.puntoDocumentos)
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  // Relación con el documento asignado al punto
  @ManyToOne(() => Documento, (documento) => documento.puntoDocumentos)
  @JoinColumn({ name: 'id_documento' })
  documento: Documento;

  // Campo de control de estado (activo/inactivo)
  @Column()
  estado: boolean;

  // Campo de control de visibilidad lógica (eliminado o no)
  @Column()
  status: boolean;
}
