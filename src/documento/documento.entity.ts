import { Asistencia } from 'src/asistencia/asistencia.entity';
import { PuntoDocumento } from 'src/punto-documento/punto-documento.entity';
import { Punto } from 'src/punto/punto.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Documento {
  @PrimaryGeneratedColumn()
  id_documento: number;

  @Column()
  nombre: string;

  @Column()
  url: string;

  @Column()
  fecha_subida: Date;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;


  @OneToMany(() => SesionDocumento, sesionDocumento => sesionDocumento.sesion)
  sesionDocumentos: SesionDocumento[];

  @OneToMany(() => PuntoDocumento, puntoDocumento => puntoDocumento.punto)
  puntoDocumentos: PuntoDocumento[];
}
