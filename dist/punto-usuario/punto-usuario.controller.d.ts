import { PuntoUsuario } from './punto-usuario.entity';
import { PuntoUsuarioService } from './punto-usuario.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { VotoDto } from 'src/auth/dto/voto.dto';
export declare class PuntoUsuarioController extends BaseController<PuntoUsuario> {
    private readonly puntoUsuarioService;
    private readonly websocketGateway;
    constructor(puntoUsuarioService: PuntoUsuarioService, websocketGateway: WebsocketGateway);
    getService(): BaseService<PuntoUsuario>;
    generarPorSesion(idSesion: number): Promise<void>;
    eliminarPorSesion(idSesion: number): Promise<void>;
    voto(votoDto: VotoDto): Promise<void>;
    cambiarPrincipalAlterno(idSesion: number, idUsuario: number): Promise<void>;
}
