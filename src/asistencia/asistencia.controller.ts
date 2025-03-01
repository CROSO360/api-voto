import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { Asistencia } from './asistencia.entity';
import { AsistenciaService } from './asistencia.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('asistencia')
export class AsistenciaController extends BaseController<Asistencia> {

    constructor(private readonly asistenciaService: AsistenciaService) {
        super();
    }

    getService(): BaseService<Asistencia> {
        return this.asistenciaService;
    }

}
