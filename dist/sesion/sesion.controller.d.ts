import { Response } from 'express';
import { Sesion } from './sesion.entity';
import { SesionService } from './sesion.service';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
export declare class SesionController extends BaseController<Sesion> {
    private readonly sesionService;
    constructor(sesionService: SesionService);
    getService(): BaseService<Sesion>;
    generarReporte(id: number, res: Response): Promise<void>;
}
