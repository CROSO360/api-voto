import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {

    constructor(private readonly usuarioService: UsuarioService) {}

    async validateUser(codigo: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findOne({ codigo });
    if (user && pass == user.contrasena) {
      const { contrasena, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales incorrectas');
    }

}
