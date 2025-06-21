// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Miembro } from './miembro.entity';
import { MiembroService } from './miembro.service';
import { MiembroController } from './miembro.controller';

// =======================================================
// MÓDULO: MiembroModule
// =======================================================

@Module({
  imports: [TypeOrmModule.forFeature([Miembro])],
  providers: [MiembroService],
  controllers: [MiembroController],
  exports: [MiembroService],
})
export class MiembroModule {}
