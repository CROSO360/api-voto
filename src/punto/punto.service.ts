import { Injectable } from '@nestjs/common';
import { Punto } from './punto.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PuntoService extends BaseService<Punto>{

    constructor(
        @InjectRepository(Punto) private puntoRepo: Repository<Punto>
    ){
        super();
    }

    getRepository(): Repository<Punto> {
        return this.puntoRepo;
    }

}
