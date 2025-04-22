import { Asistencia } from 'src/asistencia/asistencia.entity';
import { GrupoUsuario } from 'src/grupo-usuario/grupo-usuario.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt';
import { Miembro } from 'src/miembro/miembro.entity';
import { Facultad } from 'src/facultad/facultad.entity';
import { Auditoria } from 'src/auditoria/auditoria.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  cedula: string; // Ahora es pública y se maneja directamente

  @Column()
  contrasena: string; // encriptar

  @Column()
  tipo: string;

  @ManyToOne(() => GrupoUsuario, (grupoUsuario) => grupoUsuario.usuarios)
  @JoinColumn({ name: 'id_grupo_usuario' })
  grupoUsuario: GrupoUsuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioReemplazo)
  @JoinColumn({ name: 'id_usuario_reemplazo' })
  usuarioReemplazo: Usuario;

  @ManyToOne(() => Facultad, (facultad) => facultad.usuarios)
  @JoinColumn({ name: 'id_facultad' })
  facultad: Facultad;

  @Column()
  es_reemplazo: boolean;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;

  @OneToMany(() => PuntoUsuario, (puntoUsuario) => puntoUsuario.usuario)
  puntoUsuarios: PuntoUsuario[];

  @OneToMany(() => Asistencia, (asistencia) => asistencia.usuario)
  asistencias: Asistencia[];

  @OneToMany(() => Miembro, (miembro) => miembro.usuario)
  miembros: Miembro[];

  @OneToMany(() => Auditoria, (auditoria) => auditoria.usuario)
  auditorias: Auditoria[];

  @OneToMany(() => PuntoUsuario, (puntoUsuario) => puntoUsuario.votante)
  votosEmitidos: PuntoUsuario[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashFields() {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error("ENCRYPTION_KEY no está definida en el entorno.");
    }

    if (this.contrasena) {
      this.contrasena = await bcrypt.hash(this.contrasena, 10);
    }

    if (this.cedula) {
      this.cedula = CryptoJS.AES.encrypt(this.cedula, encryptionKey).toString();
    }
  }

}
