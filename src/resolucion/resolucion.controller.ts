import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { Resolucion } from './resolucion.entity';
import { ResolucionService } from './resolucion.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('resolucion')
export class ResolucionController extends BaseController<Resolucion> {

    constructor(private readonly resolucionService: ResolucionService) {
        super();
    }

    getService(): BaseService<Resolucion> {
        return this.resolucionService;
    }

}
