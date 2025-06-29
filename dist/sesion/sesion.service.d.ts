import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';
import { Punto } from 'src/punto/punto.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Documento } from 'src/documento/documento.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
import { BaseService } from 'src/commons/commons.service';
export declare class SesionService extends BaseService<Sesion> {
    private readonly sesionRepo;
    private readonly puntoRepo;
    private readonly puntoUsuarioRepo;
    private readonly documentoRepo;
    private readonly sesionDocumentoRepo;
    constructor(sesionRepo: Repository<Sesion>, puntoRepo: Repository<Punto>, puntoUsuarioRepo: Repository<PuntoUsuario>, documentoRepo: Repository<Documento>, sesionDocumentoRepo: Repository<SesionDocumento>);
    getRepository(): Repository<Sesion>;
    generarReporteSesion(idSesion: number): Promise<Buffer>;
}
