// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { SesionDocumentoService } from './sesion-documento.service';
import { SesionDocumentoController } from './sesion-documento.controller';
import { SesionDocumento } from './sesion-documento.entity';

// =======================================================
// MÓDULO: SesionDocumentoModule
// =======================================================

@Module({
  imports: [TypeOrmModule.forFeature([SesionDocumento])],
  providers: [SesionDocumentoService],
  controllers: [SesionDocumentoController],
  exports: [SesionDocumentoService],
})
export class SesionDocumentoModule {}
