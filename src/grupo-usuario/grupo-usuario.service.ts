import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { GrupoUsuario } from './grupo-usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GrupoUsuarioService extends BaseService<GrupoUsuario>{

    constructor(
        @InjectRepository(GrupoUsuario) private grupoUsuarioRepo: Repository<GrupoUsuario>
    ){
        super();
    }

    getRepository(): Repository<GrupoUsuario> {
        return this.grupoUsuarioRepo;
    }

}
