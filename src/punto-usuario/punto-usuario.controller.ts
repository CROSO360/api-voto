import { Body, Controller, Param, Post } from '@nestjs/common';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { PuntoUsuarioService } from './punto-usuario.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Controller('punto-usuario')
export class PuntoUsuarioController extends BaseController<PuntoUsuario> {

    constructor(private readonly puntoUsuarioService: PuntoUsuarioService, private readonly websocketGateway: WebsocketGateway) {
        super();
    }

    getService(): BaseService<PuntoUsuario> {
        return this.puntoUsuarioService;
    }

    @Post('voto')
    async asignarVoto(@Body() entity: PuntoUsuario){
        const sape = await this.puntoUsuarioService.save(entity);
        this.websocketGateway.emitChange(sape.id_punto_usuario);
    }

}
