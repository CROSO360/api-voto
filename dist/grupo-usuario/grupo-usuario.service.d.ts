import { Repository } from 'typeorm';
import { BaseService } from 'src/commons/commons.service';
import { GrupoUsuario } from './grupo-usuario.entity';
export declare class GrupoUsuarioService extends BaseService<GrupoUsuario> {
    private readonly grupoUsuarioRepo;
    constructor(grupoUsuarioRepo: Repository<GrupoUsuario>);
    getRepository(): Repository<GrupoUsuario>;
}
