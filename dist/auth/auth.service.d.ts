import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { PuntoUsuarioService } from 'src/punto-usuario/punto-usuario.service';
import { SesionService } from 'src/sesion/sesion.service';
export declare class AuthService {
    private readonly usuarioService;
    private readonly jwtService;
    private readonly sesionService;
    private readonly puntoUsuarioService;
    constructor(usuarioService: UsuarioService, jwtService: JwtService, sesionService: SesionService, puntoUsuarioService: PuntoUsuarioService);
    validateUser(codigo: string, pass: string): Promise<any>;
    validateVoter(codigo: string, cedula: string): Promise<any>;
    validateVoterReemplazo(codigo: string, cedula: string): Promise<any>;
}
