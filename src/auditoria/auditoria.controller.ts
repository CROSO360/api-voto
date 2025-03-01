import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { Auditoria } from './auditoria.entity';
import { AuditoriaService } from './auditoria.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('auditoria')
export class AuditoriaController extends BaseController<Auditoria> {

    constructor(private readonly auditoriaService: AuditoriaService) {
        super();
    }

    getService(): BaseService<Auditoria> {
        return this.auditoriaService;
    }

}
