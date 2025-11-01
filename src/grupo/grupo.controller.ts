import { Body, Controller, Get, Post } from '@nestjs/common';
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

}
