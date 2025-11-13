// =======================================================
// IMPORTACIONES
// =======================================================

import { Controller, Get } from '@nestjs/common';

// =======================================================
// CONTROLADORES Y SERVICIOS BASE
// =======================================================

import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';

// =======================================================
// ENTIDAD Y SERVICIO
// =======================================================

import { Miembro } from './miembro.entity';
import { MiembroService } from './miembro.service';

// =======================================================
// CONTROLADOR: MiembroController
// =======================================================

@Controller('miembro')
export class MiembroController extends BaseController<Miembro> {
  constructor(private readonly miembroService: MiembroService) {
    super();
  }

  getService(): BaseService<Miembro> {
    return this.miembroService;
  }

  
  @Get('miembros-reemplazos')
  async getMiembrosYReemplazos() {
    return this.miembroService.getMiembrosYReemplazos();
  }
}
