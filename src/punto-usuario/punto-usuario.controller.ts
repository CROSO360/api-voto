// =======================================================
// IMPORTACIONES
// =======================================================

import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PuntoUsuario } from './punto-usuario.entity';
import { PuntoUsuarioService } from './punto-usuario.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { VotoDto } from 'src/auth/dto/voto.dto';
import { VotarGrupoDto, VotarGrupoRespuesta } from 'src/auth/dto/votar-grupo.dto';

// =======================================================
// CONTROLADOR: PuntoUsuarioController
// =======================================================

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

  // ===================================================
  // GENERACIÓN Y ELIMINACIÓN MASIVA DE VOTOS
  // ===================================================

  @Post('generar-puntovoto/:idSesion')
  async generarPorSesion(
    @Param('idSesion', ParseIntPipe) idSesion: number,
  ): Promise<void> {
    return this.puntoUsuarioService.generarVotacionesPorSesion(idSesion);
  }

  @Post('eliminar-puntovoto/:idSesion')
  async eliminarPorSesion(
    @Param('idSesion', ParseIntPipe) idSesion: number,
  ): Promise<void> {
    return this.puntoUsuarioService.eliminarVotacionesPorSesion(idSesion);
  }

  // ===================================================
  // REGISTRO DE VOTO
  // ===================================================

  @Post('voto')
  @UseGuards(AuthGuard)
  async voto(@Body() votoDto: VotoDto): Promise<void> {
    const idPU = await this.puntoUsuarioService.validarVoto(
      votoDto.codigo,
      votoDto.idUsuario,
      votoDto.punto,
      votoDto.opcion,
      votoDto.es_razonado,
      votoDto.votante,
    );

    this.websocketGateway.emitChange(idPU);
  }

  @Post('votar-grupo/:idGrupo')
  @UseGuards(AuthGuard)
  async votarGrupo(
    @Param('idGrupo', ParseIntPipe) idGrupo: number,
    @Body() dto: VotarGrupoDto,
  ): Promise<VotarGrupoRespuesta> {
    return this.puntoUsuarioService.votarGrupo(idGrupo, dto);
  }


  // ===================================================
  // CAMBIO PRINCIPAL ↔ REEMPLAZO
  // ===================================================

  @Post('cambiar-principal-alterno')
  @UseGuards(AuthGuard)
  async cambiarPrincipalAlterno(
    @Body('id_sesion', ParseIntPipe) idSesion: number,
    @Body('id_usuario', ParseIntPipe) idUsuario: number,
  ): Promise<void> {
    await this.puntoUsuarioService.cambiarPrincipalAlterno(idSesion, idUsuario);
  }
}
