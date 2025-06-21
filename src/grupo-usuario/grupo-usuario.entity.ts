// =======================================================
// IMPORTACIONES
// =======================================================

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';

// =======================================================
// ENTIDAD: GrupoUsuario
// =======================================================

@Entity()
export class GrupoUsuario {
  @PrimaryGeneratedColumn()
  id_grupo_usuario: number;

  @Column()
  nombre: string;

  @Column({ type: 'float' })
  peso: number;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;

  // Relación con usuarios que pertenecen a este grupo
  @OneToMany(() => Usuario, usuario => usuario.grupoUsuario)
  usuarios: Usuario[];
}
