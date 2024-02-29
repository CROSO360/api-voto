import { Module } from '@nestjs/common';
import { PuntoUsuarioService } from './punto-usuario.service';
import { PuntoUsuarioController } from './punto-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntoUsuario } from './punto-usuario.entity';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { SesionService } from 'src/sesion/sesion.service';
import { SesionModule } from 'src/sesion/sesion.module';

@Module({
  imports:[TypeOrmModule.forFeature([PuntoUsuario]), SesionModule],
  providers: [PuntoUsuarioService, WebsocketGateway,SesionModule],
  controllers: [PuntoUsuarioController],
  exports: [PuntoUsuarioService]
})
export class PuntoUsuarioModule {}
