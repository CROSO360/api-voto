import { Resolucion } from 'src/resolucion/resolucion.entity';
import { Usuario } from 'src/usuario/usuario.entity';
export declare class Auditoria {
    id_auditoria: number;
    resolucion: Resolucion;
    usuario: Usuario;
    fecha_anterior: Date;
    nombre_anterior: string;
    descripcion_anterior: string;
    voto_manual_anterior: boolean;
    fecha_actual: Date;
    nombre_actual: string;
    descripcion_actual: string;
    voto_manual_actual: boolean;
}
