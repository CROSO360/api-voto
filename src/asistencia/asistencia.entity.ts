
import { Sesion } from 'src/sesion/sesion.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Asistencia {
  @PrimaryGeneratedColumn()
  id_asistencia: number;

  @ManyToOne(() => Sesion, (sesion) => sesion.asistencias)
  @JoinColumn({ name: 'id_sesion' })
  sesion: Sesion;

  @ManyToOne(() => Usuario, (usuario) => usuario.asistencias)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column()
  tipo_asistencia: string;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
}
