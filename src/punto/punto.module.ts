import { Module } from '@nestjs/common';
import { PuntoService } from './punto.service';
import { PuntoController } from './punto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Punto } from './punto.entity';
import { SesionModule } from 'src/sesion/sesion.module';
import { ResolucionModule } from 'src/resolucion/resolucion.module';
import { PuntoUsuarioModule } from 'src/punto-usuario/punto-usuario.module';

@Module({
  imports:[TypeOrmModule.forFeature([Punto]), SesionModule, ResolucionModule, PuntoUsuarioModule],
  providers: [PuntoService],
  controllers: [PuntoController],
  exports: [PuntoService,  TypeOrmModule.forFeature([Punto])]
})
export class PuntoModule {}
