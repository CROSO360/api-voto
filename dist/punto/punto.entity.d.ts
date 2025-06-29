import { Sesion } from 'src/sesion/sesion.entity';
import { Resolucion } from 'src/resolucion/resolucion.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { PuntoDocumento } from 'src/punto-documento/punto-documento.entity';
export declare class Punto {
    id_punto: number;
    sesion: Sesion;
    nombre: string;
    detalle: string;
    orden: number;
    es_administrativa: boolean;
    n_afavor: number;
    p_afavor: number;
    n_encontra: number;
    p_encontra: number;
    n_abstencion: number;
    p_abstencion: number;
    resultado: string;
    estado: boolean;
    status: boolean;
    puntoUsuarios: PuntoUsuario[];
    puntoDocumentos: PuntoDocumento[];
    resolucion: Resolucion;
}
