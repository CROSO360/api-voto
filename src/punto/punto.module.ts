// ==============================
// IMPORTACIONES
// ==============================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Punto } from './punto.entity';
import { PuntoService } from './punto.service';
import { PuntoController } from './punto.controller';

import { SesionModule } from 'src/sesion/sesion.module';
import { ResolucionModule } from 'src/resolucion/resolucion.module';
import { PuntoUsuarioModule } from 'src/punto-usuario/punto-usuario.module';

// ==============================
// MÓDULO: PuntoModule
// ==============================

@Module({
  imports: [
    // Entidad principal del módulo
    TypeOrmModule.forFeature([Punto]),

    // Módulos relacionados usados por el servicio
    SesionModule,
    ResolucionModule,
    PuntoUsuarioModule,
  ],
  providers: [
    // Servicio que contiene la lógica de negocio del módulo
    PuntoService,
  ],
  controllers: [
    // Controlador que expone los endpoints HTTP
    PuntoController,
  ],
  exports: [
    // Exportación del servicio y del repositorio TypeORM
    PuntoService,
    TypeOrmModule.forFeature([Punto]),
  ],
})
export class PuntoModule {}
