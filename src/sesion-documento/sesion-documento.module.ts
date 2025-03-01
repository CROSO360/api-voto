import { Module } from '@nestjs/common';
import { SesionDocumentoService } from './sesion-documento.service';
import { SesionDocumentoController } from './sesion-documento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionDocumento } from './sesion-documento.entity';

@Module({
  imports:[TypeOrmModule.forFeature([SesionDocumento])],
  providers: [SesionDocumentoService],
  controllers: [SesionDocumentoController],
  exports: [SesionDocumentoService]
})
export class SesionDocumentoModule {}
