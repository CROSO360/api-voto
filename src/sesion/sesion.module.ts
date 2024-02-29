import { Module } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';
import { Sesion } from './sesion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Sesion])],
  providers: [SesionService],
  controllers: [SesionController],
  exports: [SesionService, TypeOrmModule.forFeature([Sesion])]
})
export class SesionModule {}
