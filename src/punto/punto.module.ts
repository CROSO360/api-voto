import { Module } from '@nestjs/common';
import { PuntoService } from './punto.service';
import { PuntoController } from './punto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Punto } from './punto.entity';
import { SesionModule } from 'src/sesion/sesion.module';

@Module({
  imports:[TypeOrmModule.forFeature([Punto]), SesionModule],
  providers: [PuntoService],
  controllers: [PuntoController],
  exports: [PuntoService]
})
export class PuntoModule {}
