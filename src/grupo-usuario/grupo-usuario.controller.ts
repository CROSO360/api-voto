import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { GrupoUsuario } from './grupo-usuario.entity';
import { GrupoUsuarioService } from './grupo-usuario.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('grupo-usuario')
export class GrupoUsuarioController extends BaseController<GrupoUsuario> {

    constructor(private readonly grupoUsuarioService: GrupoUsuarioService) {
        super();
    }

    getService(): BaseService<GrupoUsuario> {
        return this.grupoUsuarioService;
    }

}
