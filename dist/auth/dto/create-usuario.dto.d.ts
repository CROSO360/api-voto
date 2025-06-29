import { Usuario } from 'src/usuario/usuario.entity';
export declare class CreateUsuarioDto {
    nombre: string;
    codigo: string;
    cedula: string;
    contrasena: string;
    tipo: string;
    usuarioReemplazo: Usuario;
}
