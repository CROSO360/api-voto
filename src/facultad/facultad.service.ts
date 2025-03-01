import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { Facultad } from './facultad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FacultadService extends BaseService<Facultad>{

    constructor(
        @InjectRepository(Facultad) private facultadRepo: Repository<Facultad>
    ){
        super();
    }

    getRepository(): Repository<Facultad> {
        return this.facultadRepo;
    }

}


