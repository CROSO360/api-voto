import { Module } from '@nestjs/common';
import { AsistenciaController } from './asistencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciaService } from './asistencia.service';
import { Asistencia } from './asistencia.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Miembro } from 'src/miembro/miembro.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Asistencia, Sesion, Miembro])],
  providers: [AsistenciaService],
  controllers: [AsistenciaController]
})
export class AsistenciaModule {}
