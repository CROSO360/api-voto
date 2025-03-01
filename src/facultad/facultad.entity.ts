import { Usuario } from 'src/usuario/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(() => Usuario, usuario => usuario.facultad)
  usuarios: Usuario[];
}
