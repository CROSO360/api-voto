// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AsistenciaController } from './asistencia.controller';
import { AsistenciaService } from './asistencia.service';
import { Asistencia } from './asistencia.entity';

import { Sesion } from 'src/sesion/sesion.entity';
import { Miembro } from 'src/miembro/miembro.entity';

// =======================================================
// MÓDULO: AsistenciaModule
// =======================================================

@Module({
  imports: [
    TypeOrmModule.forFeature([Asistencia, Sesion, Miembro]), // Repositorios requeridos
  ],
  providers: [AsistenciaService], // Lógica de negocio
  controllers: [AsistenciaController], // Rutas y endpoints
})
export class AsistenciaModule {}
