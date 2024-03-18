import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Punto {
  @PrimaryGeneratedColumn()
  id_punto: number;

  @ManyToOne(() => Sesion, sesion => sesion.puntos)
  @JoinColumn({name: "id_sesion"})
  sesion: Sesion;

  @Column()
  nombre: string;

  @Column()
  detalle: string;

  @Column()
  n_afavor: string;

  @Column({type: 'float'})
  afavor: number;

  @Column()
  n_encontra: string;

  @Column({type: 'float'})
  encontra: number;

  @Column()
  n_abstinencia: string;

  @Column({type: 'float'})
  abstinencia: number;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
  

  @OneToMany(() => PuntoUsuario, puntoUsuario => puntoUsuario.punto)
  puntoUsuarios: PuntoUsuario[];
}
