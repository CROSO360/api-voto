import { Module } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './auditoria.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Auditoria])],
  providers: [AuditoriaService],
  controllers: [AuditoriaController],
  exports: [AuditoriaService]
})
export class AuditoriaModule {}
