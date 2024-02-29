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
  
    throw new UnauthorizedException('Credenciales incorrectas');
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
  
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  /*async validarVoto(codigo: string, idUsuario: number, puntos: number[], opcion: string): Promise<any> {
    const query = { codigo };
    const relations = [];

    let votos = [];
    
    const sesion = await this.sesionService.findOneBy(query, relations);
  
    // Verifica si se encontró un usuario y si las credenciales coinciden
    if (sesion && idUsuario && puntos && opcion) {
      
      puntos.forEach(async (e)=>{
        let id_punto = e;
        let query = { punto: { id_punto: id_punto }, usuario: { id_usuario: idUsuario } };
        const relations = ['punto','usuario'];

        const puntoUsuario = await this.puntoUsuarioService.findOneBy(query,relations);

        let puntoUsuarioData: any = {
          id_punto_usuario: puntoUsuario.id_punto_usuario,
          opcion: opcion,
        }

        votos.push(puntoUsuarioData);

        const voto = await this.puntoUsuarioService.save(puntoUsuarioData);
        //this.websocketGateway.emitChange(voto.id_punto_usuario);

      });

      return votos;

    }
  
    throw new UnauthorizedException('Credenciales incorrectas');
  }*/
  
}
