// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/commons/commons.service';
import { Resultado } from './resultado.entity';

// =======================================================
// SERVICIO: ResultadoService
// =======================================================

@Injectable()
export class ResultadoService extends BaseService<Resultado> {
  constructor(
    @InjectRepository(Resultado)
    private readonly resultadoRepo: Repository<Resultado>,
  ) {
    super();
  }

  getRepository(): Repository<Resultado> {
    return this.resultadoRepo;
  }
}
