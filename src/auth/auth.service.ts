import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PuntoUsuarioService } from 'src/punto-usuario/punto-usuario.service';
import { Punto } from 'src/punto/punto.entity';
import { SesionService } from 'src/sesion/sesion.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly sesionService: SesionService,
    private readonly puntoUsuarioService: PuntoUsuarioService,
  ) {}

  async validateUser(codigo: string, pass: string): Promise<any> {
    const query = { codigo };
    const relations = ['usuarioReemplazo', 'grupoUsuario'];

    let user = await this.usuarioService.findOneBy(query, relations);

    console.log('Usuario encontrado en BD:', user); // Verifica si la contraseña se está obteniendo

    if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar que la contraseña no sea null antes de comparar
    if (!user.contrasena) {
        console.error('Contraseña en BD es NULL o no fue recuperada:', user);
        throw new UnauthorizedException('El usuario no tiene contraseña almacenada');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.contrasena);

    if (isPasswordValid && user.tipo === 'administrador') {
        const {
            contrasena,
            puntoUsuarios,
            codigo,
            usuarioReemplazo,
            grupoUsuario,
            ...result
        } = user;

        const payload = { codigo: user.codigo, nombre: user.nombre };
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            result,
        };
    }

    throw new UnauthorizedException('Credenciales de administrador incorrectas');
}


  async validateVoter(codigo: string, cedula: string): Promise<any> {
    const query = { codigo };
    const relations = ['usuarioReemplazo', 'grupoUsuario'];

    const user = await this.usuarioService.findOneBy(query, relations);

    if (user && user.tipo === 'votante') {
      // Desencriptar la cédula almacenada con AES
      const decryptedBytes = CryptoJS.AES.decrypt(
        user.cedula,
        process.env.ENCRYPTION_KEY || 'clave-secreta',
      );
      const decryptedCedula = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (decryptedCedula === cedula) {
        const {
          contrasena,
          puntoUsuarios,
          codigo,
          usuarioReemplazo,
          grupoUsuario,
          ...result
        } = user;

        const payload = {
          id: user.id_usuario,
          codigo: user.codigo,
          nombre: user.nombre,
        };
        const token = await this.jwtService.signAsync(payload);

        return {
          token,
          result,
        };
      }
    }

    throw new UnauthorizedException('Credenciales de votante incorrectas');
  }

  async validateVoterReemplazo(codigo: string, cedula: string): Promise<any> {
    const query = { codigo };
    const relations = ['grupoUsuario'];

    const user = await this.usuarioService.findOneBy(query, relations);

    if (user && user.tipo === 'votante') {
      // Desencriptar la cédula almacenada con AES
      const decryptedBytes = CryptoJS.AES.decrypt(
        user.cedula,
        process.env.ENCRYPTION_KEY || 'clave-secreta',
      );
      const decryptedCedula = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (decryptedCedula === cedula) {
        const usuarioPrincipal = await this.usuarioService.findOneBy(
          { usuarioReemplazo: user },
          relations,
        );

        if (!usuarioPrincipal) {
          throw new UnauthorizedException(
            'El usuario no es un reemplazo de ningún otro usuario.',
          );
        }

        const payload = {
          id: user.id_usuario,
          codigo: user.codigo,
          nombre: user.nombre,
          id_principal: usuarioPrincipal.id_usuario,
          nombre_principal: usuarioPrincipal.nombre,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
          token,
          result: {
            ...user,
            principal: usuarioPrincipal,
          },
        };
      }
    }

    throw new UnauthorizedException('Credenciales de votante incorrectas');
  }
}
