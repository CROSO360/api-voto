import { Controller, Get } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { PuntoGrupo } from './punto-grupo.entity';
import { BaseService } from 'src/commons/commons.service';
import { PuntoGrupoService } from './punto-grupo.service';

@Controller('punto-grupo')
export class PuntoGrupoController extends BaseController<PuntoGrupo> {
  constructor(private readonly puntoGrupoService: PuntoGrupoService) {
    super();
  }

  getService(): BaseService<PuntoGrupo> {
    return this.puntoGrupoService;
  }

}