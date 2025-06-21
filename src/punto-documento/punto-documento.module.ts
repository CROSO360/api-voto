// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { PuntoDocumento } from './punto-documento.entity';
import { PuntoDocumentoService } from './punto-documento.service';
import { PuntoDocumentoController } from './punto-documento.controller';

// =======================================================
// MÓDULO: PuntoDocumentoModule
// Define el módulo para gestionar documentos vinculados a puntos
// =======================================================

@Module({
  imports: [
    TypeOrmModule.forFeature([PuntoDocumento]) 
  ],
  providers: [PuntoDocumentoService],         
  controllers: [PuntoDocumentoController],      
  exports: [PuntoDocumentoService]              
})
export class PuntoDocumentoModule {}
