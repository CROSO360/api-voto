import { Controller } from '@nestjs/common';
import { Usuario } from './usuario.entity';
import { BaseController } from 'src/commons/commons.controller';
import { UsuarioService } from './usuario.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('usuario')
export class UsuarioController extends BaseController<Usuario> {
  constructor(private readonly usuarioService: UsuarioService) {
    super();
  }

  getService(): BaseService<Usuario> {
    return this.usuarioService;
  }

}
