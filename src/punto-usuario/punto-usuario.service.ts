import { Injectable } from '@nestjs/common';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PuntoUsuarioService extends BaseService<PuntoUsuario>{

    constructor(
        @InjectRepository(PuntoUsuario) private puntoUsuarioRepo: Repository<PuntoUsuario>
    ){
        super();
    }

    getRepository(): Repository<PuntoUsuario> {
        return this.puntoUsuarioRepo;
    }

}
