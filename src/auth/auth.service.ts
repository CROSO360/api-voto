// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { PuntoUsuarioService } from 'src/punto-usuario/punto-usuario.service';
import { SesionService } from 'src/sesion/sesion.service';

import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

// =======================================================
// SERVICIO: AuthService
// =======================================================

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly sesionService: SesionService,
    private readonly puntoUsuarioService: PuntoUsuarioService,
  ) {}

  // ===================================================
  // ADMINISTRADOR: Validación de acceso por código y contraseña
  // ===================================================
  async validateUser(codigo: string, pass: string): Promise<any> {
    const query = { codigo };
    const relations = ['usuarioReemplazo', 'grupoUsuario'];

    const user = await this.usuarioService.findOneBy(query, relations);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.contrasena) {
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

  // ===================================================
  // VOTANTE PRINCIPAL: Validación por código y cédula
  // ===================================================
  async validateVoter(codigo: string, cedula: string): Promise<any> {
    const query = { codigo };
    const relations = ['usuarioReemplazo', 'grupoUsuario'];

    const user = await this.usuarioService.findOneBy(query, relations);

    if (user && user.tipo === 'votante') {
      // Aquí normalmente se desencriptaría la cédula, pero se compara directamente por diseño actual
      if (user.cedula === cedula) {
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

  // ===================================================
  // VOTANTE REEMPLAZO: Validación por cédula y código
  // ===================================================
  async validateVoterReemplazo(codigo: string, cedula: string): Promise<any> {
    const query = { codigo };
    const relations = ['grupoUsuario'];

    const user = await this.usuarioService.findOneBy(query, relations);

    if (user && user.tipo === 'votante' && user.cedula === cedula) {
      const usuarioPrincipal = await this.usuarioService.getUsuarioPrincipalPorReemplazo(user.id_usuario);

      if (!usuarioPrincipal) {
        throw new UnauthorizedException('El usuario no es un reemplazo de ningún otro usuario.');
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

    throw new UnauthorizedException('Credenciales de votante incorrectas');
  }
}
