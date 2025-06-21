// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// =======================================================
// BASE
// =======================================================

import { BaseService } from 'src/commons/commons.service';

// =======================================================
// ENTIDAD
// =======================================================

import { Facultad } from './facultad.entity';

// =======================================================
// SERVICIO: FacultadService
// =======================================================

@Injectable()
export class FacultadService extends BaseService<Facultad> {
  constructor(
    @InjectRepository(Facultad)
    private facultadRepo: Repository<Facultad>,
  ) {
    super();
  }

  getRepository(): Repository<Facultad> {
    return this.facultadRepo;
  }
}
