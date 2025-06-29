import { PuntoService } from './punto.service';
import { Punto } from './punto.entity';
import { CreatePuntoDto } from 'src/auth/dto/create-punto.dto';
import { ResultadoManualDto } from 'src/auth/dto/resultado-manual.dto';
export declare class PuntoController {
    private readonly puntoService;
    constructor(puntoService: PuntoService);
    findAll(query: any): Promise<Punto[]>;
    findOne(id: any): Promise<Punto>;
    findOneBy(query?: any): Promise<Punto>;
    findAllBy(query?: any): Promise<Punto[]>;
    count(): Promise<number>;
    save(entity: Punto): Promise<Punto>;
    saveMany(entities: Punto[]): Promise<Punto[]>;
    crearPunto(createPuntoDto: CreatePuntoDto): Promise<Punto>;
    eliminarPunto(idPunto: number): Promise<void>;
    moverPunto(body: {
        idPunto: number;
        posicionInicial: number;
        posicionFinal: number;
    }): Promise<void>;
    calcularResultados(id: number): Promise<{
        message: string;
    }>;
    registrarResultadoManual(dto: ResultadoManualDto): Promise<void>;
    getResultadoPunto(idPunto: number): Promise<any>;
}
