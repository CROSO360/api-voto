// =======================================================
// IMPORTACIONES
// =======================================================

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Punto } from 'src/punto/punto.entity';
import { Auditoria } from 'src/auditoria/auditoria.entity';

// =======================================================
// ENTIDAD: Resolucion
// =======================================================

@Entity()
export class Resolucion {

  // ID compartido con Punto (relación 1:1)
  @PrimaryColumn()
  id_punto: number;

  @OneToOne(() => Punto, punto => punto.resolucion)
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fecha: Date;

  @Column()
  voto_manual: boolean;

  @Column()
  estado: boolean;

  @Column()
  status: boolean;

  // Relación con auditorías asociadas a esta resolución
  @OneToMany(() => Auditoria, auditoria => auditoria.resolucion)
  auditorias: Auditoria[];
}
