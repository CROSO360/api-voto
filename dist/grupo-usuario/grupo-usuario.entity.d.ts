import { Usuario } from 'src/usuario/usuario.entity';
export declare class GrupoUsuario {
    id_grupo_usuario: number;
    nombre: string;
    peso: number;
    estado: boolean;
    status: boolean;
    usuarios: Usuario[];
}
