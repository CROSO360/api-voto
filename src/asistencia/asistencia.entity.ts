// =======================================================
// IMPORTACIONES
// =======================================================

import { Sesion } from 'src/sesion/sesion.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// =======================================================
// ENTIDAD: Asistencia
// =======================================================

@Entity()
export class Asistencia {
  @PrimaryGeneratedColumn()
  id_asistencia: number;

  // Sesión a la que pertenece esta asistencia
  @ManyToOne(() => Sesion, (sesion) => sesion.asistencias)
  @JoinColumn({ name: 'id_sesion' })
  sesion: Sesion;

  // Usuario que registró la asistencia
  @ManyToOne(() => Usuario, (usuario) => usuario.asistencias)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Tipo de asistencia: presente | remoto | ausente
  @Column()
  tipo_asistencia: string;

  // Define si el registro está activo en el sistema
  @Column()
  estado: boolean;

  // Define si el registro está habilitado para uso lógico
  @Column()
  status: boolean;
}
