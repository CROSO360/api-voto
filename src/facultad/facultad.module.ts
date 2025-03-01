import { Module } from '@nestjs/common';
import { FacultadService } from './facultad.service';
import { FacultadController } from './facultad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultad } from './facultad.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Facultad])],
  providers: [FacultadService],
  controllers: [FacultadController],
  exports: [FacultadService]
})
export class FacultadModule {}
