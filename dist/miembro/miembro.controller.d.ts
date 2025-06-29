import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { Miembro } from './miembro.entity';
import { MiembroService } from './miembro.service';
export declare class MiembroController extends BaseController<Miembro> {
    private readonly miembroService;
    constructor(miembroService: MiembroService);
    getService(): BaseService<Miembro>;
}
