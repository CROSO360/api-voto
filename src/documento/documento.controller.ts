import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { DocumentoService } from './documento.service';
import { BaseService } from 'src/commons/commons.service';
import { Documento } from './documento.entity';

@Controller('documento')
export class DocumentoController extends BaseController<Documento> {

    constructor(private readonly documentoService: DocumentoService) {
        super();
    }

    getService(): BaseService<Documento> {
        return this.documentoService;
    }

}
