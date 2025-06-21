// =======================================================
// IMPORTACIONES
// =======================================================

import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { DocumentoService } from './documento.service';
import { Documento } from './documento.entity';
import { AuthGuard } from 'src/auth/auth.guard';

// =======================================================
// CONTROLADOR: DocumentoController
// =======================================================

@Controller('documento')
export class DocumentoController extends BaseController<Documento> {
  constructor(private readonly documentoService: DocumentoService) {
    super();
  }

  getService(): BaseService<Documento> {
    return this.documentoService;
  }

  // ===================================================
  // ENDPOINT: POST /documento/subir
  // Sube un archivo al sistema y crea su registro
  // ===================================================

  @Post('subir')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  subirDocumento(@UploadedFile() file: Express.Multer.File) {
    return this.documentoService.subirDocumento(file);
  }

  // ===================================================
  // ENDPOINT: DELETE /documento/eliminar/:id
  // Elimina el archivo y su registro
  // ===================================================

  @Delete('eliminar/:id')
  @UseGuards(AuthGuard)
  async eliminarDocumento(@Param('id', ParseIntPipe) id: number) {
    return this.documentoService.eliminarDocumento(id);
  }
}
