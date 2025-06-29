import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { PuntoDocumento } from './punto-documento.entity';
import { PuntoDocumentoService } from './punto-documento.service';
export declare class PuntoDocumentoController extends BaseController<PuntoDocumento> {
    private readonly puntoDocumentoService;
    constructor(puntoDocumentoService: PuntoDocumentoService);
    getService(): BaseService<PuntoDocumento>;
}
