import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { GrupoUsuario } from './grupo-usuario.entity';
import { GrupoUsuarioService } from './grupo-usuario.service';
export declare class GrupoUsuarioController extends BaseController<GrupoUsuario> {
    private readonly grupoUsuarioService;
    constructor(grupoUsuarioService: GrupoUsuarioService);
    getService(): BaseService<GrupoUsuario>;
}
