import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { Miembro } from './miembro.entity';
import { MiembroService } from './miembro.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('miembro')
export class MiembroController extends BaseController<Miembro> {

    constructor(private readonly miembroService: MiembroService) {
        super();
    }

    getService(): BaseService<Miembro> {
        return this.miembroService;
    }

}
