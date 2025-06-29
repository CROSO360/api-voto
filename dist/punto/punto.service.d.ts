import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Punto } from './punto.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Resolucion } from 'src/resolucion/resolucion.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { CreatePuntoDto } from 'src/auth/dto/create-punto.dto';
import { ResultadoManualDto } from 'src/auth/dto/resultado-manual.dto';
export declare class PuntoService {
    private puntoRepo;
    private readonly sesionRepo;
    private readonly resolucionRepo;
    private readonly puntoUsuarioRepo;
    private dataSource;
    constructor(puntoRepo: Repository<Punto>, sesionRepo: Repository<Sesion>, resolucionRepo: Repository<Resolucion>, puntoUsuarioRepo: Repository<PuntoUsuario>, dataSource: DataSource);
    getRepository(): Repository<Punto>;
    findAll(relations?: string[]): Promise<Punto[]>;
    findOne(id: any): Promise<Punto>;
    findOneBy(query: any, relations: string[]): Promise<Punto>;
    findAllBy(query: any, relations: string[]): Promise<Punto[]>;
    save(entity: Punto): Promise<Punto>;
    saveMany(entities: Punto[]): Promise<Punto[]>;
    count(options?: FindManyOptions<Punto>): Promise<number>;
    crearPunto(createPuntoDto: CreatePuntoDto): Promise<Punto>;
    eliminarPunto(idPunto: number): Promise<void>;
    reordenarPunto(idPunto: number, posicionInicial: number, posicionFinal: number): Promise<void>;
    calcularResultados(id_punto: number): Promise<void>;
    calcularResultadosManual(dto: ResultadoManualDto): Promise<void>;
    getResultadosPunto(idPunto: number): Promise<any[]>;
}
