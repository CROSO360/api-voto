// =======================================================
// IMPORTACIONES
// =======================================================

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Resolucion } from './resolucion.entity';
import { ResolucionService } from './resolucion.service';
import { ResolucionController } from './resolucion.controller';

import { PuntoModule } from 'src/punto/punto.module';

// =======================================================
// MÓDULO: ResolucionModule
// =======================================================

@Module({
  imports: [
    TypeOrmModule.forFeature([Resolucion]),
    forwardRef(() => PuntoModule),
  ],
  providers: [ResolucionService],
  controllers: [ResolucionController],
  exports: [ResolucionService, TypeOrmModule.forFeature([Resolucion])],
})
export class ResolucionModule {}
