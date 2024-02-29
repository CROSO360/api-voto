import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { PuntoUsuarioService } from './punto-usuario.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { VotoDto } from 'src/auth/dto/voto.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('punto-usuario')
export class PuntoUsuarioController extends BaseController<PuntoUsuario> {
  constructor(
    private readonly puntoUsuarioService: PuntoUsuarioService,
    private readonly websocketGateway: WebsocketGateway,
  ) {
    super();
  }

  getService(): BaseService<PuntoUsuario> {
    return this.puntoUsuarioService;
  }

  @Post('voto')
  @UseGuards(AuthGuard)
  async voto(@Body() votoDto: VotoDto) {
    const sape = await this.puntoUsuarioService.validarVoto(
      votoDto.codigo,
      votoDto.id_usuario,
      votoDto.punto,
      votoDto.opcion,
    );
    this.websocketGateway.emitChange(sape);
  }
}
