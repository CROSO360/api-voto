import { Injectable } from '@nestjs/common';
import { Sesion } from './sesion.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SesionService extends BaseService<Sesion>{

    constructor(
        @InjectRepository(Sesion) private sesionRepo: Repository<Sesion>
    ){
        super();
    }

    getRepository(): Repository<Sesion> {
        return this.sesionRepo;
    }

}
