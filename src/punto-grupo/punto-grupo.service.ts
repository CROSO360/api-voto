import { Injectable } from '@nestjs/common';
import { PuntoGrupo } from './punto-grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons/commons.service';
import { Repository } from 'typeorm';

@Injectable()
export class PuntoGrupoService extends BaseService<PuntoGrupo>{
    constructor(
        @InjectRepository(PuntoGrupo)
        private readonly puntoGrupoRepo: Repository<PuntoGrupo>,
      ) {
        super();
      }
    
      getRepository(): Repository<PuntoGrupo> {
        return this.puntoGrupoRepo;
      }
}
