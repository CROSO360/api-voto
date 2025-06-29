import { DataSource, Repository } from 'typeorm';
import { Resolucion } from './resolucion.entity';
import { BaseService } from 'src/commons/commons.service';
import { UpdateResolucionDto } from 'src/auth/dto/update-resolucion.dto';
export declare class ResolucionService extends BaseService<Resolucion> {
    private readonly resolucionRepo;
    private readonly dataSource;
    constructor(resolucionRepo: Repository<Resolucion>, dataSource: DataSource);
    getRepository(): Repository<Resolucion>;
    actualizarResolucion(dto: UpdateResolucionDto): Promise<void>;
}
