import { Module } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { DocumentoController } from './documento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documento } from './documento.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Documento])],
  providers: [DocumentoService],
  controllers: [DocumentoController],
  exports: [DocumentoService]
})
export class DocumentoModule {}
