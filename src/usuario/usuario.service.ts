import { Injectable } from '@nestjs/common';
import { Usuario } from './usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService extends BaseService<Usuario> {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
  ) {
    super();
  }

  getRepository(): Repository<Usuario> {
    return this.usuarioRepo;
  }

}
