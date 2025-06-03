import { Module } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';
import { Sesion } from './sesion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoModule } from 'src/documento/documento.module';
import { SesionDocumentoModule } from 'src/sesion-documento/sesion-documento.module';
import { Punto } from 'src/punto/punto.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Documento } from 'src/documento/documento.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Sesion, Punto, PuntoUsuario, Documento, SesionDocumento])],
  providers: [SesionService],
  controllers: [SesionController],
  exports: [SesionService, TypeOrmModule.forFeature([Sesion])]
})
export class SesionModule {}
