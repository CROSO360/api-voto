import { Repository } from 'typeorm';
import { BaseService } from 'src/commons/commons.service';
import { Facultad } from './facultad.entity';
export declare class FacultadService extends BaseService<Facultad> {
    private facultadRepo;
    constructor(facultadRepo: Repository<Facultad>);
    getRepository(): Repository<Facultad>;
}
