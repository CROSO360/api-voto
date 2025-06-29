import { SesionDocumento } from './sesion-documento.entity';
import { SesionDocumentoService } from './sesion-documento.service';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
export declare class SesionDocumentoController extends BaseController<SesionDocumento> {
    private readonly sesionDocumentoService;
    constructor(sesionDocumentoService: SesionDocumentoService);
    getService(): BaseService<SesionDocumento>;
}
