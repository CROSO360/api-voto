import { Repository } from 'typeorm';
import { BaseService } from 'src/commons/commons.service';
import { Auditoria } from './auditoria.entity';
export declare class AuditoriaService extends BaseService<Auditoria> {
    private auditoriaRepo;
    constructor(auditoriaRepo: Repository<Auditoria>);
    getRepository(): Repository<Auditoria>;
}
