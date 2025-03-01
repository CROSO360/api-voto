import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resolucion } from './resolucion.entity';
import { BaseService } from 'src/commons/commons.service';

@Injectable()
export class ResolucionService extends BaseService<Resolucion> {
  constructor(
    @InjectRepository(Resolucion) private resolucionRepo: Repository<Resolucion>
  ) {
    super();
  }

    getRepository(): Repository<Resolucion> {
        return this.resolucionRepo;
    }

}
