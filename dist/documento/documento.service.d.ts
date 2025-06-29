import { Repository } from 'typeorm';
import { Documento } from './documento.entity';
import { BaseService } from 'src/commons/commons.service';
export declare class DocumentoService extends BaseService<Documento> {
    private readonly documentoRepo;
    constructor(documentoRepo: Repository<Documento>);
    getRepository(): Repository<Documento>;
    subirDocumento(file: Express.Multer.File): Promise<Documento>;
    eliminarDocumento(id: number): Promise<{
        message: string;
    }>;
}
