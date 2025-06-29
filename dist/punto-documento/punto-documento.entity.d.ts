import { Punto } from 'src/punto/punto.entity';
import { Documento } from 'src/documento/documento.entity';
export declare class PuntoDocumento {
    id_punto_documento: number;
    punto: Punto;
    documento: Documento;
    estado: boolean;
    status: boolean;
}
