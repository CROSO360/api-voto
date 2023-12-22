import { Punto } from 'src/punto/punto.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Sesion {
  @PrimaryGeneratedColumn()
  id_sesion: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  fecha: Date;

  @Column()
  tipo: string;

  @Column()
  oficio: string;

  @Column()
  periodo: string;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;


  @OneToMany(() => Punto, punto => punto.sesion)
  puntos: Punto[];
}
