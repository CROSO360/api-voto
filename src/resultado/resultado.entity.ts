// =======================================================
// IMPORTACIONES
// =======================================================

import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Punto } from 'src/punto/punto.entity';

// =======================================================
// ENTIDAD: Resultado
// =======================================================

@Entity()
export class Resultado {
  @PrimaryColumn()
  id_punto: number;

  @OneToOne(() => Punto, punto => punto.resultadoDetalle)
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  @Column({ type: 'float', nullable: true })
  n_mitad_miembros_presente: number;

  @Column({ type: 'float', nullable: true })
  mitad_miembros_ponderado: number;

  @Column({ type: 'float', nullable: true })
  dos_terceras_ponderado: number;

  @Column({ type: 'float', nullable: true })
  n_dos_terceras_miembros: number;

  @Column({ type: 'int', nullable: true })
  n_ausentes: number;

  @Column({ type: 'int', nullable: true })
  n_total: number;

  @Column({
    type: 'enum',
    enum: ['aprobada', 'rechazada', 'pendiente', 'empate'],
    nullable: true,
  })
  estado_ponderado: 'aprobada' | 'rechazada' | 'pendiente' | 'empate' | null;

  @Column({
    type: 'enum',
    enum: ['aprobada', 'rechazada', 'pendiente', 'empate'],
    nullable: true,
  })
  estado_nominal: 'aprobada' | 'rechazada' | 'pendiente' | 'empate' | null;
}
