import { Module } from '@nestjs/common';
import { PuntoUsuarioService } from './punto-usuario.service';
import { PuntoUsuarioController } from './punto-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntoUsuario } from './punto-usuario.entity';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  imports:[TypeOrmModule.forFeature([PuntoUsuario])],
  providers: [PuntoUsuarioService, WebsocketGateway],
  controllers: [PuntoUsuarioController]
})
export class PuntoUsuarioModule {}
