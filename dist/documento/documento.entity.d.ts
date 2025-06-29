import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
import { PuntoDocumento } from 'src/punto-documento/punto-documento.entity';
export declare class Documento {
    id_documento: number;
    nombre: string;
    url: string;
    fecha_subida: Date;
    estado: boolean;
    status: boolean;
    sesionDocumentos: SesionDocumento[];
    puntoDocumentos: PuntoDocumento[];
}
