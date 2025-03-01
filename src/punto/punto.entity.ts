import { PuntoDocumento } from 'src/punto-documento/punto-documento.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Resolucion } from 'src/resolucion/resolucion.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';

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
  p_afavor: number;

  @Column()
  n_encontra: string;

  @Column({type: 'float'})
  p_encontra: number;

  @Column()
  n_abstencion: string;

  @Column({type: 'float'})
  p_abstencion: number;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
  

  @OneToMany(() => PuntoUsuario, puntoUsuario => puntoUsuario.punto)
  puntoUsuarios: PuntoUsuario[];

  @OneToMany(() => PuntoDocumento, puntoDocumento => puntoDocumento.punto)
    puntoDocumentos: PuntoDocumento[];

  @OneToOne(() => Resolucion, resolucion => resolucion.punto)
  resolucion: Resolucion;
}
