import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { Auditoria } from './auditoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuditoriaService extends BaseService<Auditoria>{

    constructor(
        @InjectRepository(Auditoria) private auditoriaRepo: Repository<Auditoria>
    ){
        super();
    }

    getRepository(): Repository<Auditoria> {
        return this.auditoriaRepo;
    }

}
