import { Controller } from '@nestjs/common';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { PuntoUsuarioService } from './punto-usuario.service';

@Controller('punto-usuario')
export class PuntoUsuarioController extends BaseController<PuntoUsuario> {

    constructor(private readonly puntoUsuarioService: PuntoUsuarioService) {
        super();
    }

    getService(): BaseService<PuntoUsuario> {
        return this.puntoUsuarioService;
    }

}
