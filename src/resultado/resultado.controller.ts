// =======================================================
// IMPORTACIONES
// =======================================================

import { Controller } from '@nestjs/common';

import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';

import { Resultado } from './resultado.entity';
import { ResultadoService } from './resultado.service';

// =======================================================
// CONTROLADOR: ResultadoController
// =======================================================

@Controller('resultado')
export class ResultadoController extends BaseController<Resultado> {
  constructor(private readonly resultadoService: ResultadoService) {
    super();
  }

  getService(): BaseService<Resultado> {
    return this.resultadoService;
  }
}
