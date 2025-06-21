// =======================================================
// IMPORTACIONES
// =======================================================

import { Controller } from '@nestjs/common';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { SesionDocumento } from './sesion-documento.entity';
import { SesionDocumentoService } from './sesion-documento.service';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';

// =======================================================
// CONTROLADOR: SesionDocumentoController
// =======================================================

@Controller('sesion-documento')
export class SesionDocumentoController extends BaseController<SesionDocumento> {

  constructor(
    private readonly sesionDocumentoService: SesionDocumentoService,
  ) {
    super();
  }

  // Provee el servicio base requerido por BaseController
  getService(): BaseService<SesionDocumento> {
    return this.sesionDocumentoService;
  }
}
