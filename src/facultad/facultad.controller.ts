// =======================================================
// IMPORTACIONES
// =======================================================

import { Controller } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';

// =======================================================
// ENTIDAD Y SERVICIO
// =======================================================

import { Facultad } from './facultad.entity';
import { FacultadService } from './facultad.service';

// =======================================================
// CONTROLADOR: FacultadController
// =======================================================

@Controller('facultad')
export class FacultadController extends BaseController<Facultad> {
  constructor(private readonly facultadService: FacultadService) {
    super();
  }

  getService(): BaseService<Facultad> {
    return this.facultadService;
  }
}
