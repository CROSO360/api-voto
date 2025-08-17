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
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { PuntoUsuarioModule } from 'src/punto-usuario/punto-usuario.module';

// =======================================================
// MÓDULO: AsistenciaModule
// =======================================================

@Module({
  imports: [
    TypeOrmModule.forFeature([Asistencia, Sesion, Miembro,PuntoUsuario]), // Repositorios requeridos
    PuntoUsuarioModule
  ],
  providers: [AsistenciaService], // Lógica de negocio
  controllers: [AsistenciaController], // Rutas y endpoints
})
export class AsistenciaModule {}
