
import { Documento } from 'src/documento/documento.entity';
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
export class SesionDocumento {
  @PrimaryGeneratedColumn()
  id_sesion_documento: number;

  @ManyToOne(() => Sesion, (sesion) => sesion.sesionDocumentos)
  @JoinColumn({ name: 'id_sesion' })
  sesion: Sesion;

  @ManyToOne(() => Documento, (documento) => documento.sesionDocumentos)
  @JoinColumn({ name: 'id_documento' })
  documento: Documento;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
}