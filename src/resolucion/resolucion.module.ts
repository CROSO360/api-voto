import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolucionController } from './resolucion.controller';
import { Resolucion } from './resolucion.entity';
import { PuntoModule } from 'src/punto/punto.module';
import { ResolucionService } from './resolucion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resolucion]),
    forwardRef(() => PuntoModule),
  ],
  providers: [ResolucionService],
  controllers: [ResolucionController],
  exports: [ResolucionService, TypeOrmModule.forFeature([Resolucion])],
})
export class ResolucionModule {}