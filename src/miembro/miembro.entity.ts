// =======================================================
// IMPORTACIONES
// =======================================================

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';

// =======================================================
// ENTIDAD: Miembro
// =======================================================

@Entity()
export class Miembro {
  @PrimaryGeneratedColumn()
  id_miembro: number;

  @ManyToOne(() => Usuario, usuario => usuario.miembros)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;
}
