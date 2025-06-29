import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Punto } from 'src/punto/punto.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
export declare class Sesion {
    id_sesion: number;
    nombre: string;
    codigo: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    tipo: string;
    fase: string;
    estado: boolean;
    status: boolean;
    puntos: Punto[];
    asistencias: Asistencia[];
    sesionDocumentos: SesionDocumento[];
}
