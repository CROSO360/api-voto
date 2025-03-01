import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { Facultad } from './facultad.entity';
import { FacultadService } from './facultad.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('facultad')
export class FacultadController extends BaseController<Facultad> {

    constructor(private readonly facultadService: FacultadService) {
        super();
    }

    getService(): BaseService<Facultad> {
        return this.facultadService;
    }

}
