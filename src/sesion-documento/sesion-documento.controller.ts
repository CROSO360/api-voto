import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { SesionDocumento } from './sesion-documento.entity';
import { SesionDocumentoService } from './sesion-documento.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('sesion-documento')
export class SesionDocumentoController extends BaseController<SesionDocumento> {

    constructor(private readonly sesionDocumentoService: SesionDocumentoService) {
        super();
    }

    getService(): BaseService<SesionDocumento> {
        return this.sesionDocumentoService;
    }

}
