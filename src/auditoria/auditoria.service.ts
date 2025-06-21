// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/commons/commons.service';
import { Auditoria } from './auditoria.entity';

// =======================================================
// SERVICIO: AuditoriaService
// =======================================================

@Injectable()
export class AuditoriaService extends BaseService<Auditoria> {

  constructor(
    @InjectRepository(Auditoria)
    private auditoriaRepo: Repository<Auditoria>,
  ) {
    super();
  }

  getRepository(): Repository<Auditoria> {
    return this.auditoriaRepo;
  }

}
