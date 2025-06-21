// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// =======================================================
// ENTIDADES Y SERVICIOS BASE
// =======================================================

import { Miembro } from './miembro.entity';
import { BaseService } from 'src/commons/commons.service';

// =======================================================
// SERVICIO: MiembroService
// =======================================================

@Injectable()
export class MiembroService extends BaseService<Miembro> {
  constructor(
    @InjectRepository(Miembro)
    private readonly miembroRepo: Repository<Miembro>,
  ) {
    super();
  }

  getRepository(): Repository<Miembro> {
    return this.miembroRepo;
  }
}
