import { Repository } from 'typeorm';
import { PuntoDocumento } from './punto-documento.entity';
import { BaseService } from 'src/commons/commons.service';
export declare class PuntoDocumentoService extends BaseService<PuntoDocumento> {
    private readonly puntoDocumentoRepo;
    constructor(puntoDocumentoRepo: Repository<PuntoDocumento>);
    getRepository(): Repository<PuntoDocumento>;
}
