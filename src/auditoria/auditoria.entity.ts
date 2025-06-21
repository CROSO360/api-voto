// =======================================================
// IMPORTACIONES
// =======================================================

import { Resolucion } from 'src/resolucion/resolucion.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// =======================================================
// ENTIDAD: Auditoria
// =======================================================

@Entity()
export class Auditoria {
  @PrimaryGeneratedColumn()
  id_auditoria: number;

  // Resolución asociada
  @ManyToOne(() => Resolucion, (resolucion) => resolucion.auditorias)
  @JoinColumn({ name: 'id_punto' })
  resolucion: Resolucion;

  // Usuario que realizó el cambio
  @ManyToOne(() => Usuario, (usuario) => usuario.auditorias)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Valores anteriores
  @Column()
  fecha_anterior: Date;

  @Column()
  nombre_anterior: string;

  @Column()
  descripcion_anterior: string;

  @Column()
  voto_manual_anterior: boolean;

  // Valores actuales
  @Column()
  fecha_actual: Date;

  @Column()
  nombre_actual: string;

  @Column()
  descripcion_actual: string;

  @Column()
  voto_manual_actual: boolean;
}
