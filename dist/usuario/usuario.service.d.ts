import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from 'src/auth/dto/create-usuario.dto';
export declare class UsuarioService {
    private usuarioRepo;
    constructor(usuarioRepo: Repository<Usuario>);
    findAll(relations?: string[]): Promise<Usuario[]>;
    findOne(id: number, relations?: string[]): Promise<Usuario>;
    findOneBy(query: any, relations?: string[]): Promise<Usuario>;
    findAllBy(query: any, relations?: string[]): Promise<Usuario[]>;
    createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    updateUsuario(entity: Usuario): Promise<Usuario>;
    deleteUsuario(id: number): Promise<void>;
    count(): Promise<number>;
    obtenerReemplazosDisponibles(idUsuario: number): Promise<any>;
    getUsuarioPrincipalPorReemplazo(idUsuarioReemplazo: number): Promise<Usuario | null>;
    private processUser;
    private processUsers;
}
