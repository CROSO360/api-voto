// ==========================================
// IMPORTACIONES
// ==========================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Sesion } from 'src/sesion/sesion.entity';
import { PuntoGrupo } from 'src/punto-grupo/punto-grupo.entity';

// ==========================================
// ENTIDAD: Grupo
// ==========================================
@Entity()
export class Grupo {
  @PrimaryGeneratedColumn()
  id_grupo: number;

  // Relación con la sesión a la que pertenece el punto
  @ManyToOne(() => Sesion, (sesion) => sesion.grupos)
  @JoinColumn({ name: 'id_sesion' })
  sesion: Sesion;

  @Column()
  nombre: string;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;


  @OneToMany(() => PuntoGrupo, (puntoGrupo) => puntoGrupo.grupo)
  puntoGrupos: PuntoGrupo[];
}
