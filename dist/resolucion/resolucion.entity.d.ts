import { Punto } from 'src/punto/punto.entity';
import { Auditoria } from 'src/auditoria/auditoria.entity';
export declare class Resolucion {
    id_punto: number;
    punto: Punto;
    nombre: string;
    descripcion: string;
    fecha: Date;
    voto_manual: boolean;
    estado: boolean;
    status: boolean;
    auditorias: Auditoria[];
}
