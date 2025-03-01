import { Module } from '@nestjs/common';
import { PuntoDocumentoService } from './punto-documento.service';
import { PuntoDocumentoController } from './punto-documento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntoDocumento } from './punto-documento.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PuntoDocumento])],
  providers: [PuntoDocumentoService],
  controllers: [PuntoDocumentoController],
  exports: [PuntoDocumentoService]
})
export class PuntoDocumentoModule {}
