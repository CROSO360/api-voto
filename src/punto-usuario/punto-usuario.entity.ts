import { Punto } from 'src/punto/punto.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class PuntoUsuario {
  @PrimaryGeneratedColumn()
  id_punto_usuario: number;

  @ManyToOne(() => Punto, punto => punto.puntoUsuarios)
  @JoinColumn({name: "id_punto"})
  punto: Punto;

  @ManyToOne(() => Usuario, usuario => usuario.puntoUsuarios)
  @JoinColumn({name: "id_usuario"})
  usuario: Usuario;

  @Column()
  opcion: string;

  @Column()
  es_razonado: boolean;

  @Column()
  es_principal: boolean;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;

}
