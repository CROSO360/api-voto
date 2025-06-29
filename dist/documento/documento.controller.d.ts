import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { DocumentoService } from './documento.service';
import { Documento } from './documento.entity';
export declare class DocumentoController extends BaseController<Documento> {
    private readonly documentoService;
    constructor(documentoService: DocumentoService);
    getService(): BaseService<Documento>;
    subirDocumento(file: Express.Multer.File): Promise<Documento>;
    eliminarDocumento(id: number): Promise<{
        message: string;
    }>;
}
