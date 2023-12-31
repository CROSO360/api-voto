import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {

    constructor(
      private readonly usuarioService: UsuarioService,
      private readonly jwtService: JwtService,
      ) {}

    async validateUser(codigo: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findOne({ codigo });
    if (user && pass == user.contrasena && user.tipo == 'administrador') {
      const { contrasena, ...result } = user;

      const payload = { codigo: user.codigo }

      const token = await this.jwtService.signAsync(payload)

      return {
        token,
        result
      };
      
    }
    throw new UnauthorizedException('Credenciales incorrectas');
    }

}
