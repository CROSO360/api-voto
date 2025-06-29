import { Punto } from 'src/punto/punto.entity';
import { Usuario } from 'src/usuario/usuario.entity';
export declare class PuntoUsuario {
    id_punto_usuario: number;
    punto: Punto;
    usuario: Usuario;
    opcion: string;
    es_razonado: boolean;
    votante: Usuario;
    es_principal: boolean;
    fecha: Date;
    estado: boolean;
    status: boolean;
}
