import { GrupoUsuario } from 'src/grupo-usuario/grupo-usuario.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  contrasena: string;

  @Column()
  cedula: string;

  @Column()
  tipo: string;

  @ManyToOne(() => GrupoUsuario, grupoUsuario => grupoUsuario.usuarios)
  @JoinColumn({name: "id_grupo_usuario"})
  grupoUsuario: GrupoUsuario;

  @ManyToOne(() => Usuario, usuario => usuario.usuarioReemplazo)
  @JoinColumn({name: "id_usuario_reemplazo"})
  usuarioReemplazo: Usuario;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;


  @OneToMany(() => PuntoUsuario, puntoUsuario => puntoUsuario.usuario)
  puntoUsuarios: PuntoUsuario[];

}
