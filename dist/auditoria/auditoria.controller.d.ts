import { BaseController } from 'src/commons/commons.controller';
import { Auditoria } from './auditoria.entity';
import { AuditoriaService } from './auditoria.service';
import { BaseService } from 'src/commons/commons.service';
export declare class AuditoriaController extends BaseController<Auditoria> {
    private readonly auditoriaService;
    constructor(auditoriaService: AuditoriaService);
    getService(): BaseService<Auditoria>;
}
