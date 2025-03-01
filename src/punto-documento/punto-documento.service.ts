import { Injectable } from '@nestjs/common';
import { PuntoDocumento } from './punto-documento.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PuntoDocumentoService extends BaseService<PuntoDocumento>{

    constructor(
        @InjectRepository(PuntoDocumento) private puntoDocumentoRepo: Repository<PuntoDocumento>
    ){
        super();
    }

    getRepository(): Repository<PuntoDocumento> {
        return this.puntoDocumentoRepo;
    }

}
