import { DataSource, Repository } from 'typeorm';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { SesionService } from 'src/sesion/sesion.service';
import { Punto } from 'src/punto/punto.entity';
import { Miembro } from 'src/miembro/miembro.entity';
export declare class PuntoUsuarioService extends BaseService<PuntoUsuario> {
    private puntoUsuarioRepo;
    private readonly puntoRepo;
    private readonly miembroRepo;
    private readonly sesionService;
    private dataSource;
    constructor(puntoUsuarioRepo: Repository<PuntoUsuario>, puntoRepo: Repository<Punto>, miembroRepo: Repository<Miembro>, sesionService: SesionService, dataSource: DataSource);
    getRepository(): Repository<PuntoUsuario>;
    generarVotacionesPorSesion(idSesion: number): Promise<void>;
    eliminarVotacionesPorSesion(idSesion: number): Promise<void>;
    validarVoto(codigo: string, idUsuario: number, punto: number, opcion: string | null, es_razonado: boolean, votante: number): Promise<number>;
    cambiarPrincipalAlterno(idSesion: number, idUsuario: number): Promise<void>;
}
