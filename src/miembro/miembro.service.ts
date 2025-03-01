import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { Miembro } from './miembro.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MiembroService extends BaseService<Miembro>{

    constructor(
        @InjectRepository(Miembro) private miembroRepo: Repository<Miembro>
    ){
        super();
    }

    getRepository(): Repository<Miembro> {
        return this.miembroRepo;
    }

}

