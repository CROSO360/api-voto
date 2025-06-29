import { GrupoUsuario } from 'src/grupo-usuario/grupo-usuario.entity';
import { Facultad } from 'src/facultad/facultad.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Miembro } from 'src/miembro/miembro.entity';
import { Auditoria } from 'src/auditoria/auditoria.entity';
export declare class Usuario {
    id_usuario: number;
    nombre: string;
    codigo: string;
    cedula: string;
    contrasena: string;
    tipo: string;
    es_reemplazo: boolean;
    estado: boolean;
    status: boolean;
    grupoUsuario: GrupoUsuario;
    usuarioReemplazo: Usuario;
    facultad: Facultad;
    asistencias: Asistencia[];
    puntoUsuarios: PuntoUsuario[];
    votosEmitidos: PuntoUsuario[];
    miembros: Miembro[];
    auditorias: Auditoria[];
    hashFields(): Promise<void>;
}
