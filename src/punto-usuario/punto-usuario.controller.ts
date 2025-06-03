import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
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

  @Post('generar-puntovoto/:idSesion')
  async generarPorSesion(@Param('idSesion') idSesion: number) {
    return this.puntoUsuarioService.generarVotacionesPorSesion(idSesion);
  }

  @Post('eliminar-puntovoto/:idSesion')
async eliminarPorSesion(@Param('idSesion') idSesion: number) {
  return this.puntoUsuarioService.eliminarVotacionesPorSesion(idSesion);
}


  @Post('voto')
@UseGuards(AuthGuard)
async voto(@Body() votoDto: VotoDto) {
  const idPU = await this.puntoUsuarioService.validarVoto(
    votoDto.codigo,
    votoDto.id_usuario,
    votoDto.punto,
    votoDto.opcion,
    votoDto.es_razonado,
    votoDto.votante
  );

  this.websocketGateway.emitChange(idPU);
}


  @Post('cambiar-principal-alterno')
  @UseGuards(AuthGuard)
  async cambiarPrincipalAlterno(
    @Body('id_sesion', ParseIntPipe) idSesion: number,
    @Body('id_usuario', ParseIntPipe) idUsuario: number,
  ) {
    await this.puntoUsuarioService.cambiarPrincipalAlterno(idSesion, idUsuario);
    //return { message: 'Cambio de principal/alterno realizado correctamente.' };
  }

}
