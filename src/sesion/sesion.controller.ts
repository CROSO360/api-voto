import { Controller } from '@nestjs/common';
import { Sesion } from './sesion.entity';
import { BaseController } from 'src/commons/commons.controller';
import { SesionService } from './sesion.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('sesion')
export class SesionController extends BaseController<Sesion> {

    constructor(private readonly sesionService: SesionService) {
        super();
    }

    getService(): BaseService<Sesion> {
        return this.sesionService;
    }

}
