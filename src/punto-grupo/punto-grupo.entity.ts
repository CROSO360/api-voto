// =======================================================
// IMPORTACIONES
// =======================================================

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { Documento } from 'src/documento/documento.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Grupo } from 'src/grupo/grupo.entity';
import { Punto } from 'src/punto/punto.entity';

// =======================================================
// ENTIDAD: PuntoGrupo
// =======================================================

@Entity()
export class PuntoGrupo {
  @PrimaryGeneratedColumn()
  id_punto_grupo: number;

  @ManyToOne(() => Grupo, (grupo) => grupo.puntoGrupos)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo;

  @ManyToOne(() => Punto, (punto) => punto.puntoGrupos)
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;

}
