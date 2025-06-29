import { Asistencia } from './asistencia.entity';
import { AsistenciaService } from './asistencia.service';
import { BaseService } from 'src/commons/commons.service';
import { BaseController } from 'src/commons/commons.controller';
export declare class AsistenciaController extends BaseController<Asistencia> {
    private readonly asistenciaService;
    constructor(asistenciaService: AsistenciaService);
    getService(): BaseService<Asistencia>;
    generarAsistencias(idSesion: number): Promise<Asistencia[]>;
    sincronizarAsistencias(idSesion: number, body: {
        usuariosSeleccionados: number[];
    }): Promise<void>;
    eliminarAsistencias(idSesion: number): Promise<void>;
}
