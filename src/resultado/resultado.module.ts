// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Resultado } from './resultado.entity';
import { ResultadoService } from './resultado.service';
import { ResultadoController } from './resultado.controller';

// =======================================================
// MODULO: ResultadoModule
// =======================================================

@Module({
  imports: [TypeOrmModule.forFeature([Resultado])],
  providers: [ResultadoService],
  controllers: [ResultadoController],
  exports: [ResultadoService, TypeOrmModule.forFeature([Resultado])],
})
export class ResultadoModule {}
