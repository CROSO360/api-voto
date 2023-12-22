import { Controller } from '@nestjs/common';
import { Punto } from './punto.entity';
import { BaseController } from 'src/commons/commons.controller';
import { PuntoService } from './punto.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('punto')
export class PuntoController extends BaseController<Punto> {

    constructor(private readonly puntoService: PuntoService) {
        super();
    }

    getService(): BaseService<Punto> {
        return this.puntoService;
    }

}
