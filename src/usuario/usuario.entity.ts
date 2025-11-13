// ==============================
// Importaciones
// ==============================

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
import { GrupoUsuario } from 'src/grupo-usuario/grupo-usuario.entity';
import { Facultad } from 'src/facultad/facultad.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Miembro } from 'src/miembro/miembro.entity';
import { Auditoria } from 'src/auditoria/auditoria.entity';

// ==============================
// Entidad Usuario
// ==============================

@Entity()
export class Usuario {
  // ===========================
  // Campos primarios y básicos
  // ===========================

  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  cedula: string; // Cédula encriptada

  @Column()
  celular: string;

  @Column()
  contrasena: string; // Contraseña con hash bcrypt

  @Column()
  tipo: string; // 'administrador' | 'votante'

  @Column()
  es_reemplazo: boolean;

  @Column()
  estado: boolean; // Control de edición/eliminación

  @Column()
  status: boolean; // Indica si está activo (para sesiones/votación)

  // ===========================
  // Relaciones
  // ===========================

  /**
   * Grupo al que pertenece el usuario.
   * Ej: profesor, estudiante, trabajador.
   */
  @ManyToOne(() => GrupoUsuario, (grupoUsuario) => grupoUsuario.usuarios)
  @JoinColumn({ name: 'id_grupo_usuario' })
  grupoUsuario: GrupoUsuario;

  /**
   * Usuario que actúa como su reemplazo (si existe).
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioReemplazo)
  @JoinColumn({ name: 'id_usuario_reemplazo' })
  usuarioReemplazo: Usuario;

  /**
   * Facultad a la que pertenece el usuario.
   */
  @ManyToOne(() => Facultad, (facultad) => facultad.usuarios)
  @JoinColumn({ name: 'id_facultad' })
  facultad: Facultad;
  

  /**
   * Vínculo a asistencias registradas.
   */
  @OneToMany(() => Asistencia, (asistencia) => asistencia.usuario)
  asistencias: Asistencia[];

  /**
   * Vínculo a los puntos donde participa como votante.
   */
  @OneToMany(() => PuntoUsuario, (puntoUsuario) => puntoUsuario.usuario)
  puntoUsuarios: PuntoUsuario[];

  /**
   * Vínculo a los puntos donde emitió el voto (puede coincidir o no con `usuario`)
   */
  @OneToMany(() => PuntoUsuario, (puntoUsuario) => puntoUsuario.votante)
  votosEmitidos: PuntoUsuario[];

  /**
   * Vínculo a registros de membresía en el OCS.
   */
  @OneToMany(() => Miembro, (miembro) => miembro.usuario)
  miembros: Miembro[];

  /**
   * Vínculo a auditorías registradas por este usuario.
   */
  @OneToMany(() => Auditoria, (auditoria) => auditoria.usuario)
  auditorias: Auditoria[];

  // ===========================
  // Hooks de encriptación/hash
  // ===========================

  /**
   * Hook que se ejecuta antes de insertar o actualizar un usuario.
   * Se encarga de hashear la contraseña y encriptar la cédula.
   */
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
