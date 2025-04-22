import { Controller, Delete, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { DocumentoService } from './documento.service';
import { BaseService } from 'src/commons/commons.service';
import { Documento } from './documento.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('documento')
export class DocumentoController extends BaseController<Documento> {

    constructor(private readonly documentoService: DocumentoService) {
        super();
    }

    getService(): BaseService<Documento> {
        return this.documentoService;
    }

    @Post('subir')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    subirDocumento(@UploadedFile() file: Express.Multer.File) {
        return this.documentoService.subirDocumento(file);
    }

    @Delete('eliminar/:id')
    @UseGuards(AuthGuard)
    async eliminarDocumento(@Param('id', ParseIntPipe) id: number) {
        return this.documentoService.eliminarDocumento(id);
    }

}
