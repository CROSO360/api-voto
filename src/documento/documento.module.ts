import { Module } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { DocumentoController } from './documento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documento } from './documento.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as multer from 'multer';

@Module({
  imports:[
    TypeOrmModule.forFeature([Documento]),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './uploads', // 📌 Guardar en la carpeta correcta
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`; // 📌 Evitar espacios en el nombre
          cb(null, uniqueName);
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/subidas',
    }),
  ],
  providers: [DocumentoService],
  controllers: [DocumentoController],
  exports: [DocumentoService]
})
export class DocumentoModule {}
