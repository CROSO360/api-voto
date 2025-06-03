import { Injectable } from '@nestjs/common';
import { Usuario } from './usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CreateUsuarioDto } from 'src/auth/dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
  ) {}

  async findAll(relations: string[] = []): Promise<Usuario[]> {
    const options = relations.length ? { relations } : {};
    const users = await this.usuarioRepo.find(options);
    return this.processUsers(users);
  }

  async findOne(id: number, relations: string[] = []): Promise<Usuario> {
    const options = relations.length
      ? { where: { id_usuario: id }, relations }
      : { where: { id_usuario: id } };
    const user = await this.usuarioRepo.findOne(options);
    return this.processUser(user);
  }

  async findOneBy(query: any, relations: string[] = []): Promise<Usuario> {
    const options: any = {
      where: query,
      relations: relations.length ? relations : undefined,
      select: [
        'id_usuario',
        'nombre',
        'codigo',
        'contrasena',
        'tipo',
        'cedula',
      ], // Asegurar que incluimos la contraseña
    };

    const user = await this.usuarioRepo.findOne(options);
    return this.processUser(user, true);
  }

  async findAllBy(query: any, relations: string[] = []): Promise<Usuario[]> {
    const options = relations.length
      ? { where: query, relations }
      : { where: query };
    const users = await this.usuarioRepo.find(options);
    return this.processUsers(users);
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepo.create(createUsuarioDto);
    return this.usuarioRepo.save(usuario);
  }

  async updateUsuario(entity: Usuario): Promise<Usuario> {
    // Obtener la clave de encriptación
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY no está definida en el entorno.');
    }

    // Buscar el usuario original en la base de datos para comparar valores
    const existingUser = await this.usuarioRepo.findOne({
      where: { id_usuario: entity.id_usuario },
    });

    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    // Si la cédula fue modificada, la re-encriptamos
    if (entity.cedula && entity.cedula !== existingUser.cedula) {
      entity.cedula = CryptoJS.AES.encrypt(
        entity.cedula,
        encryptionKey,
      ).toString();
    } else {
      // Si la cédula no cambió, mantenemos la versión encriptada original
      entity.cedula = existingUser.cedula;
    }

    // Guardar los cambios
    return await this.usuarioRepo.save(entity);
  }

  async deleteUsuario(id: number): Promise<void> {
    await this.usuarioRepo.delete(id);
  }

  async count(): Promise<number> {
    return this.usuarioRepo.count();
  }

  async processUser(user: Usuario, keepPassword = false): Promise<Usuario> {
    if (!user) return null;

    // Desencriptar la cédula si es necesario
    if (user.cedula) {
      const decryptedBytes = CryptoJS.AES.decrypt(
        user.cedula,
        process.env.ENCRYPTION_KEY,
      );
      user.cedula = decryptedBytes.toString(CryptoJS.enc.Utf8) || null;
    }

    // Eliminar la contraseña del resultado si no estamos en autenticación
    if (!keepPassword) {
      delete user.contrasena;
    }

    return user;
  }

  private async processUsers(users: Usuario[]): Promise<Usuario[]> {
    return Promise.all(users.map(async (user) => this.processUser(user)));
  }

  async obtenerReemplazosDisponibles(idUsuario: number): Promise<any> {
    // Buscar el usuario original con su grupo de usuario y su reemplazo asignado
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: idUsuario },
      relations: ['grupoUsuario', 'usuarioReemplazo'],
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Buscar si el usuario es el reemplazo de alguien más
    const usuarioPrincipal = await this.usuarioRepo.findOne({
      where: { usuarioReemplazo: { id_usuario: usuario.id_usuario } },
      relations: ['grupoUsuario'],
    });

    // Procesar si el usuario ya tiene un reemplazo asignado
    const tieneReemplazo = usuario.usuarioReemplazo
      ? await this.processUser(usuario.usuarioReemplazo)
      : null;
    const esReemplazoDe = usuarioPrincipal
      ? await this.processUser(usuarioPrincipal)
      : null;

    // Si el usuario es reemplazo de otro, no mostramos disponibles
    if (esReemplazoDe) {
      return { disponibles: [], reemplazo: tieneReemplazo, esReemplazoDe };
    }

    // **Optimización: Obtener usuarios que ya están asignados como reemplazo y tienen reemplazo en UNA SOLA CONSULTA**
    const usuariosConReemplazo = await this.usuarioRepo.find({
      where: { usuarioReemplazo: Not(IsNull()) },
      select: ['id_usuario', 'usuarioReemplazo'],
      relations: ['usuarioReemplazo'],
    });

    // Extraer IDs de usuarios con reemplazo o que ya son reemplazo de alguien
    const idsUsuariosYaAsignados = new Set<number>();
    const idsUsuariosConReemplazo = new Set<number>();

    for (const user of usuariosConReemplazo) {
      if (user.usuarioReemplazo) {
        idsUsuariosYaAsignados.add(user.usuarioReemplazo.id_usuario);
        idsUsuariosConReemplazo.add(user.id_usuario);
      }
    }

    // **Nueva lógica de exclusión**
    // No excluimos al reemplazo actual del usuario
    const idsExcluidos = new Set<number>([
      idUsuario,
      ...idsUsuariosYaAsignados,
      ...idsUsuariosConReemplazo,
    ]);
    if (usuario.usuarioReemplazo) {
      idsExcluidos.delete(usuario.usuarioReemplazo.id_usuario);
    }

    // Determinar el grupo de reemplazos disponibles
    let grupoReemplazoId = usuario.grupoUsuario.id_grupo_usuario;
    if (usuario.grupoUsuario.id_grupo_usuario === 1) {
      grupoReemplazoId = 2; // Si es Rector, los reemplazos son los Vicerrectores
    }

    // **Optimización: Filtrar usuarios elegibles en UNA SOLA CONSULTA**
    const disponibles = await this.usuarioRepo.find({
      where: {
        grupoUsuario: { id_grupo_usuario: grupoReemplazoId },
        id_usuario: Not(In([...idsExcluidos])),
      },
      relations: ['grupoUsuario'],
    });

    return {
      disponibles: await Promise.all(
        disponibles.map((user) => this.processUser(user)),
      ),
      reemplazo: tieneReemplazo,
      esReemplazoDe: esReemplazoDe,
    };
  }

  async getUsuarioPrincipalPorReemplazo(idUsuarioReemplazo: number): Promise<Usuario | null> {
    const raw = await this.usuarioRepo.query(
      `SELECT * FROM usuario WHERE id_usuario_reemplazo = ? AND tipo = 'votante' AND estado = 1 AND status = 1 LIMIT 1`,
      [idUsuarioReemplazo],
    );

    if (!raw.length) return null;

    return await this.usuarioRepo.findOne({
      where: { id_usuario: raw[0].id_usuario },
      relations: ['grupoUsuario'], // Puedes parametrizar si deseas
    });
  }

}
