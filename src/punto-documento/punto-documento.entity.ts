
import { Documento } from 'src/documento/documento.entity';
import { Punto } from 'src/punto/punto.entity';
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
export class PuntoDocumento {
  @PrimaryGeneratedColumn()
  id_punto_documento: number;

  @ManyToOne(() => Punto, (punto) => punto.puntoDocumentos)
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  @ManyToOne(() => Documento, (documento) => documento.puntoDocumentos)
  @JoinColumn({ name: 'id_documento' })
  documento: Documento;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
}