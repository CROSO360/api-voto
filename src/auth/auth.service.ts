import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PuntoUsuarioService } from 'src/punto-usuario/punto-usuario.service';
import { Punto } from 'src/punto/punto.entity';
import { SesionService } from 'src/sesion/sesion.service';
import { UsuarioService } from 'src/usuario/usuario.service';

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
    const relations = ['usuarioReemplazo', 'grupoUsuario']; // Define tus relaciones aquí si las necesitas

    const user = await this.usuarioService.findOneBy(query, relations);

    // Verifica si se encontró un usuario y si las credenciales coinciden
    if (user && pass === user.contrasena && user.tipo === 'administrador') {
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

    throw new UnauthorizedException(
      'Credenciales de administrador incorrectas',
    );
  }

  async validateVoter(codigo: string, cedula: string): Promise<any> {
    const query = { codigo };
    const relations = ['usuarioReemplazo', 'grupoUsuario']; // Define tus relaciones aquí si las necesitas

    const user = await this.usuarioService.findOneBy(query, relations);

    // Verifica si se encontró un usuario y si las credenciales coinciden
    if (user && cedula === user.cedula && user.tipo === 'votante') {
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

    throw new UnauthorizedException('Credenciales de votante incorrectas');
  }

  async validateVoterReemplazo(codigo: string, cedula: string): Promise<any> {
    const query = { codigo };
    const relations = ['grupoUsuario']; // Cargar solo las relaciones necesarias
  
    // Buscar al usuario que intenta iniciar sesión
    const user = await this.usuarioService.findOneBy(query, relations);
  
    // Validar que las credenciales sean correctas
    if (user && cedula === user.cedula && user.tipo === 'votante') {
      // Buscar si este usuario es el reemplazo de otro usuario (usuario principal)
      const usuarioPrincipal = await this.usuarioService.findOneBy(
        { usuarioReemplazo: user }, // Aquí buscamos al usuario principal que tiene a este usuario como reemplazo
        relations
      );
  
      // Si no es reemplazo de nadie, lanzar una excepción
      if (!usuarioPrincipal) {
        throw new UnauthorizedException('El usuario no es un reemplazo de ningún otro usuario.');
      }
  
      // Si es reemplazo, generar el token con la información del usuario y su principal
      const payload = {
        id: user.id_usuario,
        codigo: user.codigo,
        nombre: user.nombre,
        id_principal: usuarioPrincipal.id_usuario, // Incluir el ID del usuario principal
        nombre_principal: usuarioPrincipal.nombre, // Incluir el nombre del usuario principal
      };
  
      const token = await this.jwtService.signAsync(payload);
  
      return {
        token,
        result: {
          ...user, // Información del usuario reemplazo
          principal: usuarioPrincipal, // Información del usuario principal
        },
      };
    }
  
    // Si las credenciales son incorrectas, lanzar una excepción
    throw new UnauthorizedException('Credenciales de votante incorrectas');
  }
  
}
