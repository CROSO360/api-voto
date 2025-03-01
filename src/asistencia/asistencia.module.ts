import { Module } from '@nestjs/common';
import { AsistenciaController } from './asistencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciaService } from './asistencia.service';
import { Asistencia } from './asistencia.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Asistencia])],
  providers: [AsistenciaService],
  controllers: [AsistenciaController]
})
export class AsistenciaModule {}
