import { Sesion } from 'src/sesion/sesion.entity';
import { Usuario } from 'src/usuario/usuario.entity';
export declare class Asistencia {
    id_asistencia: number;
    sesion: Sesion;
    usuario: Usuario;
    tipo_asistencia: string;
    estado: boolean;
    status: boolean;
}
