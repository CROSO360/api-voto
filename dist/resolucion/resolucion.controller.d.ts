import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { Resolucion } from './resolucion.entity';
import { ResolucionService } from './resolucion.service';
import { UpdateResolucionDto } from 'src/auth/dto/update-resolucion.dto';
export declare class ResolucionController extends BaseController<Resolucion> {
    private readonly resolucionService;
    constructor(resolucionService: ResolucionService);
    getService(): BaseService<Resolucion>;
    actualizarResolucion(dto: UpdateResolucionDto): Promise<{
        message: string;
    }>;
}
