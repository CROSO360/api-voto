import { Module } from '@nestjs/common';
import { PuntoService } from './punto.service';
import { PuntoController } from './punto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Punto } from './punto.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Punto])],
  providers: [PuntoService],
  controllers: [PuntoController],
  exports: [PuntoService]
})
export class PuntoModule {}
