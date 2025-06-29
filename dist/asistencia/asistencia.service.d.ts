import { Repository } from 'typeorm';
import { BaseService } from 'src/commons/commons.service';
import { Asistencia } from './asistencia.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Miembro } from 'src/miembro/miembro.entity';
export declare class AsistenciaService extends BaseService<Asistencia> {
    private asistenciaRepo;
    private sesionRepo;
    private miembroRepo;
    constructor(asistenciaRepo: Repository<Asistencia>, sesionRepo: Repository<Sesion>, miembroRepo: Repository<Miembro>);
    getRepository(): Repository<Asistencia>;
    generarAsistencias(idSesion: number): Promise<Asistencia[]>;
    sincronizarAsistencias(idSesion: number, usuariosSeleccionados: number[]): Promise<void>;
    eliminarAsistencias(idSesion: number): Promise<void>;
}
