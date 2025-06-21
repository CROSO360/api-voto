// =======================================================
// IMPORTACIONES
// =======================================================

import { Controller } from '@nestjs/common';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';
import { PuntoDocumento } from './punto-documento.entity';
import { PuntoDocumentoService } from './punto-documento.service';

// =======================================================
// CONTROLADOR: PuntoDocumentoController
// Hereda métodos genéricos del controlador base
// =======================================================

@Controller('punto-documento')
export class PuntoDocumentoController extends BaseController<PuntoDocumento> {
  constructor(private readonly puntoDocumentoService: PuntoDocumentoService) {
    super();
  }

  getService(): BaseService<PuntoDocumento> {
    return this.puntoDocumentoService;
  }
}
