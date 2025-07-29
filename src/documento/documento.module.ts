// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as multer from 'multer';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { DocumentoService } from './documento.service';
import { DocumentoController } from './documento.controller';
import { Documento } from './documento.entity';

// =======================================================
// MÓDULO: DocumentoModule
// Configura subida de archivos y acceso público a /subidas
// =======================================================

@Module({
  imports: [
    TypeOrmModule.forFeature([Documento]),

    //Configuración para subida de archivos
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
          cb(null, uniqueName);
        },
      }),
    }),

    //Servir archivos estáticos en /subidas
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/api/subidas',
    }),
  ],

  providers: [DocumentoService],
  controllers: [DocumentoController],
  exports: [DocumentoService],
})
export class DocumentoModule {}
