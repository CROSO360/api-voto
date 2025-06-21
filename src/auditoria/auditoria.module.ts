// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaController } from './auditoria.controller';
import { AuditoriaService } from './auditoria.service';
import { Auditoria } from './auditoria.entity';

// =======================================================
// MÓDULO: AuditoriaModule
// =======================================================

@Module({
  imports: [TypeOrmModule.forFeature([Auditoria])],
  providers: [AuditoriaService],
  controllers: [AuditoriaController],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
