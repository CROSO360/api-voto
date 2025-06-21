// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { PuntoDocumento } from './punto-documento.entity';
import { BaseService } from 'src/commons/commons.service';

// =======================================================
// SERVICIO: PuntoDocumentoService
// Encargado de gestionar la relación entre puntos y documentos
// =======================================================

@Injectable()
export class PuntoDocumentoService extends BaseService<PuntoDocumento> {
  constructor(
    @InjectRepository(PuntoDocumento)
    private readonly puntoDocumentoRepo: Repository<PuntoDocumento>,
  ) {
    super();
  }

  getRepository(): Repository<PuntoDocumento> {
    return this.puntoDocumentoRepo;
  }
}
