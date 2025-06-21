// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// =======================================================
// MÓDULOS INTERNOS
// =======================================================

import { SesionDocumento } from './sesion-documento.entity';
import { BaseService } from 'src/commons/commons.service';

// =======================================================
// SERVICIO: SesionDocumentoService
// Lógica para manejar documentos asociados a sesiones
// =======================================================

@Injectable()
export class SesionDocumentoService extends BaseService<SesionDocumento> {

  constructor(
    @InjectRepository(SesionDocumento)
    private readonly sesionDocumentoRepo: Repository<SesionDocumento>,
  ) {
    super();
  }

  // Devuelve el repositorio asociado a la entidad
  getRepository(): Repository<SesionDocumento> {
    return this.sesionDocumentoRepo;
  }
}
