import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Punto } from 'src/punto/punto.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Sesion {
  @PrimaryGeneratedColumn()
  id_sesion: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  /*@Column()
  oficio: string;*/

  @Column()
  fecha_inicio: Date;

  @Column()
  fecha_fin: Date;

  @Column()
  tipo: string;

  @Column()
  fase: string;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;


  @OneToMany(() => Punto, punto => punto.sesion)
  puntos: Punto[];

  @OneToMany(() => Asistencia, asistencia => asistencia.sesion)
  asistencias: Asistencia[];

  @OneToMany(() => SesionDocumento, sesionDocumento => sesionDocumento.sesion)
  sesionDocumentos: SesionDocumento[];
}
