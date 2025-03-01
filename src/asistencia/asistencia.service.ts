import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons/commons.service';
import { Repository } from 'typeorm';
import { Asistencia } from './asistencia.entity';

@Injectable()
export class AsistenciaService extends BaseService<Asistencia>{

    constructor(
        @InjectRepository(Asistencia) private asistenciaRepo: Repository<Asistencia>
    ){
        super();
    }

    getRepository(): Repository<Asistencia> {
        return this.asistenciaRepo;
    }

}
