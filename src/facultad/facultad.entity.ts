// =======================================================
// IMPORTACIONES
// =======================================================

import { Usuario } from 'src/usuario/usuario.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

// =======================================================
// ENTIDAD: Facultad
// =======================================================

@Entity()
export class Facultad {
  @PrimaryGeneratedColumn()
  id_facultad: number;

  @Column()
  nombre: string;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;

  //Relación con usuarios que pertenecen a esta facultad
  @OneToMany(() => Usuario, usuario => usuario.facultad)
  usuarios: Usuario[];
}
