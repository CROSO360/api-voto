import { Injectable } from '@nestjs/common';
import { SesionDocumento } from './sesion-documento.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SesionDocumentoService extends BaseService<SesionDocumento>{

    constructor(
        @InjectRepository(SesionDocumento) private sesionDocumentoRepo: Repository<SesionDocumento>
    ){
        super();
    }

    getRepository(): Repository<SesionDocumento> {
        return this.sesionDocumentoRepo;
    }

}
