import { Documento } from 'src/documento/documento.entity';
import { Sesion } from 'src/sesion/sesion.entity';
export declare class SesionDocumento {
    id_sesion_documento: number;
    sesion: Sesion;
    documento: Documento;
    estado: boolean;
    status: boolean;
}
