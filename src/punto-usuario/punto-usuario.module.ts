// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PuntoUsuario } from './punto-usuario.entity';
import { PuntoUsuarioService } from './punto-usuario.service';
import { PuntoUsuarioController } from './punto-usuario.controller';

import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { SesionModule } from 'src/sesion/sesion.module';
import { Punto } from 'src/punto/punto.entity';
import { Miembro } from 'src/miembro/miembro.entity';

// =======================================================
// MÓDULO: PuntoUsuarioModule
// =======================================================

@Module({
  imports: [
    TypeOrmModule.forFeature([PuntoUsuario, Punto, Miembro]),
    SesionModule,
  ],
  providers: [
    PuntoUsuarioService,
    WebsocketGateway,
  ],
  controllers: [PuntoUsuarioController],
  exports: [
    PuntoUsuarioService,
    TypeOrmModule.forFeature([PuntoUsuario]),
  ],
})
export class PuntoUsuarioModule {}
