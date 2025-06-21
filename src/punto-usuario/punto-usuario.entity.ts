// =======================================================
// IMPORTACIONES
// =======================================================

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Punto } from 'src/punto/punto.entity';
import { Usuario } from 'src/usuario/usuario.entity';

// =======================================================
// ENTIDAD: PuntoUsuario
// =======================================================

@Entity()
export class PuntoUsuario {
  @PrimaryGeneratedColumn()
  id_punto_usuario: number;

  // Punto al que pertenece este voto
  @ManyToOne(() => Punto, punto => punto.puntoUsuarios)
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  // Usuario asignado a este voto (puede ser titular o reemplazo)
  @ManyToOne(() => Usuario, usuario => usuario.puntoUsuarios)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Tipo de voto emitido: 'afavor', 'encontra', 'abstencion'
  @Column()
  opcion: string;

  // Indica si el voto fue razonado (con justificación)
  @Column()
  es_razonado: boolean;

  // Usuario que efectivamente emitió el voto (puede ser el reemplazo)
  @ManyToOne(() => Usuario, votante => votante.votosEmitidos)
  @JoinColumn({ name: 'votante' })
  votante: Usuario;

  // Indica si el voto corresponde al titular (principal) o al alterno
  @Column()
  es_principal: boolean;

  // Fecha y hora del voto
  @Column()
  fecha: Date;

  // Campo de activación lógica del voto
  @Column()
  estado: boolean;

  // Campo de estado general del registro
  @Column()
  status: boolean;
}
