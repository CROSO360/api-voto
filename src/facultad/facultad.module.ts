// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// =======================================================
// ENTIDAD, SERVICIO Y CONTROLADOR
// =======================================================

import { Facultad } from './facultad.entity';
import { FacultadService } from './facultad.service';
import { FacultadController } from './facultad.controller';

// =======================================================
// MÓDULO: FacultadModule
// =======================================================

@Module({
  imports: [TypeOrmModule.forFeature([Facultad])],
  providers: [FacultadService],
  controllers: [FacultadController],
  exports: [FacultadService],
})
export class FacultadModule {}
