import { Repository } from 'typeorm';
import { SesionDocumento } from './sesion-documento.entity';
import { BaseService } from 'src/commons/commons.service';
export declare class SesionDocumentoService extends BaseService<SesionDocumento> {
    private readonly sesionDocumentoRepo;
    constructor(sesionDocumentoRepo: Repository<SesionDocumento>);
    getRepository(): Repository<SesionDocumento>;
}
