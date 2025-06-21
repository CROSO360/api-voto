// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/commons/commons.service';
import { GrupoUsuario } from './grupo-usuario.entity';

// =======================================================
// SERVICIO: GrupoUsuarioService
// =======================================================

@Injectable()
export class GrupoUsuarioService extends BaseService<GrupoUsuario> {

  constructor(
    @InjectRepository(GrupoUsuario)
    private readonly grupoUsuarioRepo: Repository<GrupoUsuario>,
  ) {
    super();
  }

  /**
   * Retorna el repositorio asociado a la entidad GrupoUsuario.
   */
  getRepository(): Repository<GrupoUsuario> {
    return this.grupoUsuarioRepo;
  }

}
