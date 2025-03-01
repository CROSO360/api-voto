import { Auditoria } from 'src/auditoria/auditoria.entity';
import { Punto } from 'src/punto/punto.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Resolucion {

  @PrimaryColumn()
  id_punto: number;

  @OneToOne(() => Punto, (punto) => punto.resolucion)
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fecha: Date;

  @Column()
  estado: boolean;

  @Column()
  staus: boolean;


  @OneToMany(() => Auditoria, (auditoria) => auditoria.resolucion)
  auditorias: Auditoria[];
}
