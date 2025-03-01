import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { PuntoDocumento } from './punto-documento.entity';
import { PuntoDocumentoService } from './punto-documento.service';

@Controller('punto-documento')
export class PuntoDocumentoController extends BaseController<PuntoDocumento> {

    constructor(private readonly puntoDocumentoService: PuntoDocumentoService) {
        super();
    }

    getService(): BaseService<PuntoDocumento> {
        return this.puntoDocumentoService;
    }

}
