import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { Documento } from './documento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentoService extends BaseService<Documento>{

    constructor(
        @InjectRepository(Documento) private documentoRepo: Repository<Documento>
    ){
        super();
    }

    getRepository(): Repository<Documento> {
        return this.documentoRepo;
    }

}

