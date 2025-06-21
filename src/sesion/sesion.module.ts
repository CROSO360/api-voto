// ==============================
// Importaciones
// ==============================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sesion } from './sesion.entity';
import { Punto } from 'src/punto/punto.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Documento } from 'src/documento/documento.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';

import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';

import { DocumentoModule } from 'src/documento/documento.module';
import { SesionDocumentoModule } from 'src/sesion-documento/sesion-documento.module';

// ==============================
// Módulo: SesionModule
// ==============================

@Module({
  imports: [
    // Repositorios de TypeORM usados por el servicio
    TypeOrmModule.forFeature([
      Sesion,
      Punto,
      PuntoUsuario,
      Documento,
      SesionDocumento,
    ]),
    // Módulos relacionados para dependencias cruzadas
    DocumentoModule,
    SesionDocumentoModule,
  ],
  providers: [
    // Servicio que contiene la lógica de negocio del módulo
    SesionService,
  ],
  controllers: [
    // Controlador que maneja las rutas HTTP para sesiones
    SesionController,
  ],
  exports: [
    // Exporta el servicio y el repositorio de Sesion para uso externo
    SesionService,
    TypeOrmModule.forFeature([Sesion]),
  ],
})
export class SesionModule {}
