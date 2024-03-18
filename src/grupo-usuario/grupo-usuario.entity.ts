import { Usuario } from 'src/usuario/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class GrupoUsuario {
  @PrimaryGeneratedColumn()
  id_grupo_usuario: number;

  @Column()
  nombre: string;

  @Column({type: 'float'})
  peso: number;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
  

  @OneToMany(() => Usuario, usuario => usuario.grupoUsuario)
  usuarios: Usuario[];
}
