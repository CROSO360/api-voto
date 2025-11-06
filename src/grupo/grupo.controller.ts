import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { Grupo } from './grupo.entity';
import { GrupoService } from './grupo.service';
import { BaseService } from 'src/commons/commons.service';
import { CreateGrupoDto } from 'src/auth/dto/create-grupo.dto';
import { CalcularResultadosGrupoDto } from 'src/auth/dto/calcular-resultados-grupo.dto';

@Controller('grupo')
export class GrupoController extends BaseController<Grupo> {
  constructor(private readonly grupoService: GrupoService) {
    super();
  }

  getService(): BaseService<Grupo> {
    return this.grupoService;
  }

  @Post('agrupar')
  async crearGrupoConPuntos(@Body() dto: CreateGrupoDto): Promise<Grupo> {
    return this.grupoService.crearGrupoConPuntos(dto);
  }

  @Post('calcular-resultados')
  async calcularResultados(@Body() dto: CalcularResultadosGrupoDto): Promise<Grupo> {
    return this.grupoService.calcularResultadosGrupo(dto);
  }

  @Post('eliminar/:idGrupo')
  async eliminarGrupo(@Param('idGrupo', ParseIntPipe) idGrupo: number) {
    await this.grupoService.eliminarGrupo(idGrupo);
    return { message: 'Grupo eliminado correctamente.' };
  }

  @Get('habilitado/:idGrupo')
  async grupoHabilitado(
    @Param('idGrupo', ParseIntPipe) idGrupo: number,
  ) {
    const habilitado = await this.grupoService.estaHabilitado(idGrupo);
    return { id_grupo: idGrupo, habilitado };
  }
}
