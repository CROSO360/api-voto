import { Repository } from 'typeorm';
import { Miembro } from './miembro.entity';
import { BaseService } from 'src/commons/commons.service';
export declare class MiembroService extends BaseService<Miembro> {
    private readonly miembroRepo;
    constructor(miembroRepo: Repository<Miembro>);
    getRepository(): Repository<Miembro>;
}
