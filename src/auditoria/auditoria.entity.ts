
import { Documento } from 'src/documento/documento.entity';
import { Resolucion } from 'src/resolucion/resolucion.entity';
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
export class Auditoria {
  @PrimaryGeneratedColumn()
  id_auditoria: number;

  @ManyToOne(() => Resolucion, (resolucion) => resolucion.auditorias)
  @JoinColumn({ name: 'id_punto' })
  resolucion: Resolucion;

  @ManyToOne(() => Usuario, (usuario) => usuario.auditorias)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column()
  fecha_anterior: Date;

  @Column()
  nombre_anterior: string;

  @Column()
  descripcion_anterior: string;

  @Column()
  voto_manual_anterior: boolean;

  @Column()
  fecha_actual: Date;

  @Column()
  nombre_actual: string;

  @Column()
  descripcion_actual: string;

  @Column()
  voto_manual_actual: boolean;
}