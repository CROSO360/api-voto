import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { Facultad } from './facultad.entity';
import { FacultadService } from './facultad.service';
export declare class FacultadController extends BaseController<Facultad> {
    private readonly facultadService;
    constructor(facultadService: FacultadService);
    getService(): BaseService<Facultad>;
}
