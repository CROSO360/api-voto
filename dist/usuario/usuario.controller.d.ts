import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from 'src/auth/dto/create-usuario.dto';
export declare class UsuarioController {
    private readonly usuarioService;
    constructor(usuarioService: UsuarioService);
    findAll(query: any): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    findOneBy(query: any): Promise<Usuario>;
    findAllBy(query: any): Promise<Usuario[]>;
    count(): Promise<number>;
    obtenerReemplazosDisponibles(id: number): Promise<Usuario[]>;
    create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    save(entity: Usuario): Promise<Usuario>;
    delete(id: number): Promise<void>;
}
