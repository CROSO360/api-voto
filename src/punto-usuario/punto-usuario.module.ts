import { Module } from '@nestjs/common';
import { PuntoUsuarioService } from './punto-usuario.service';
import { PuntoUsuarioController } from './punto-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntoUsuario } from './punto-usuario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PuntoUsuario])],
  providers: [PuntoUsuarioService],
  controllers: [PuntoUsuarioController]
})
export class PuntoUsuarioModule {}
