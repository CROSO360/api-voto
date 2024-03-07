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
    const relations = ['usuarioReemplazo','grupoUsuario']; // Define tus relaciones aquí si las necesitas
    
    const user = await this.usuarioService.findOneBy(query, relations);
  
    // Verifica si se encontró un usuario y si las credenciales coinciden
    if (user && pass === user.contrasena && user.tipo === 'administrador') {
      const { contrasena, puntoUsuarios, codigo, usuarioReemplazo, grupoUsuario, ...result } = user;
  
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
    const relations = ['usuarioReemplazo','grupoUsuario']; // Define tus relaciones aquí si las necesitas
    
    const user = await this.usuarioService.findOneBy(query, relations);
    
  
    // Verifica si se encontró un usuario y si las credenciales coinciden
    if (user && cedula === user.cedula && user.tipo === 'votante') {
      const { contrasena, puntoUsuarios, codigo, usuarioReemplazo, grupoUsuario, ...result } = user;
  
      const payload = { id: user.id_usuario, codigo: user.codigo, nombre: user.nombre };
      const token = await this.jwtService.signAsync(payload);
  
      return {
        token,
        result,
      };
    }
  
    throw new UnauthorizedException('Credenciales de votante incorrectas');
  }

  
  
}
