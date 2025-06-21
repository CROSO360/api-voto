// =======================================================
// IMPORTACIONES
// =======================================================

import { Controller } from '@nestjs/common';

import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';

import { GrupoUsuario } from './grupo-usuario.entity';
import { GrupoUsuarioService } from './grupo-usuario.service';

// =======================================================
// CONTROLADOR: GrupoUsuarioController
// =======================================================

@Controller('grupo-usuario')
export class GrupoUsuarioController extends BaseController<GrupoUsuario> {

  constructor(
    private readonly grupoUsuarioService: GrupoUsuarioService
  ) {
    super();
  }

  /**
   * Retorna el servicio asociado al controlador base.
   */
  getService(): BaseService<GrupoUsuario> {
    return this.grupoUsuarioService;
  }

}
