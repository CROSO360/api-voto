// ==============================
// Importaciones
// ==============================

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from 'src/auth/dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

// ==============================
// Servicio UsuarioService
// ==============================

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
  ) {}

  // ==============================
  // Métodos públicos
  // ==============================

  /**
   * Obtiene todos los usuarios, incluyendo relaciones si se especifican.
   */
  async findAll(relations: string[] = []): Promise<Usuario[]> {
    const options = relations.length ? { relations } : {};
    const users = await this.usuarioRepo.find(options);
    return this.processUsers(users);
  }

  /**
   * Obtiene un usuario por ID con sus relaciones, si se especifican.
   */
  async findOne(id: number, relations: string[] = []): Promise<Usuario> {
    const options = relations.length
      ? { where: { id_usuario: id }, relations }
      : { where: { id_usuario: id } };
    const user = await this.usuarioRepo.findOne(options);
    return this.processUser(user);
  }

  /**
   * Busca un usuario por condiciones personalizadas.
   * Incluye contraseña si se requiere para procesos como login.
   */
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
      ],
    };
    const user = await this.usuarioRepo.findOne(options);
    return this.processUser(user, true);
  }

  /**
   * Obtiene todos los usuarios que cumplan ciertas condiciones.
   */
  async findAllBy(query: any, relations: string[] = []): Promise<Usuario[]> {
    const options = relations.length
      ? { where: query, relations }
      : { where: query };
    const users = await this.usuarioRepo.find(options);
    return this.processUsers(users);
  }

  /**
   * Crea un nuevo usuario.
   */
  async createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    if (await this.isCedulaDuplicada(createUsuarioDto.cedula)) {
      throw new BadRequestException('Ya existe un usuario con esta cédula.');
    }
    const usuario = this.usuarioRepo.create(createUsuarioDto);
    return this.usuarioRepo.save(usuario);
  }

  /**
   * Actualiza un usuario, con re-encriptación de cédula si ha cambiado.
   */
  /**
 * Actualiza un usuario, con re-encriptación de cédula si ha cambiado.
 */
async updateUsuario(entity: Usuario): Promise<Usuario> {
  if (await this.isCedulaDuplicada(entity.cedula, entity.id_usuario)) {
    throw new BadRequestException('Ya existe un usuario con esta cédula.');
  }

  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY no está definida en el entorno.');
  }

  const existingUser = await this.usuarioRepo.findOne({
    where: { id_usuario: entity.id_usuario },
  });

  if (!existingUser) {
    throw new Error('Usuario no encontrado');
  }

  // Si la cédula cambió, la volvemos a encriptar
  const cedulaDesencriptada = CryptoJS.AES.decrypt(
    existingUser.cedula,
    encryptionKey
  ).toString(CryptoJS.enc.Utf8);

  if (entity.cedula && entity.cedula !== cedulaDesencriptada) {
    entity.cedula = CryptoJS.AES.encrypt(entity.cedula, encryptionKey).toString();
  } else {
    entity.cedula = existingUser.cedula;
  }

  return await this.usuarioRepo.save(entity);
}

  /**
   * Elimina un usuario por ID.
   */
  async deleteUsuario(id: number): Promise<void> {
    await this.usuarioRepo.delete(id);
  }

  /**
   * Retorna la cantidad total de usuarios.
   */
  async count(): Promise<number> {
    return this.usuarioRepo.count();
  }

  /**
   * Devuelve información de reemplazos disponibles para un usuario dado.
   */
  async obtenerReemplazosDisponibles(idUsuario: number): Promise<any> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: idUsuario },
      relations: ['grupoUsuario', 'usuarioReemplazo'],
    });

    if (!usuario) throw new Error('Usuario no encontrado');

    const usuarioPrincipal = await this.usuarioRepo.findOne({
      where: { usuarioReemplazo: { id_usuario: usuario.id_usuario } },
      relations: ['grupoUsuario'],
    });

    const tieneReemplazo = usuario.usuarioReemplazo
      ? await this.processUser(usuario.usuarioReemplazo)
      : null;
    const esReemplazoDe = usuarioPrincipal
      ? await this.processUser(usuarioPrincipal)
      : null;

    if (esReemplazoDe) {
      return { disponibles: [], reemplazo: tieneReemplazo, esReemplazoDe };
    }

    const usuariosConReemplazo = await this.usuarioRepo.find({
      where: { usuarioReemplazo: Not(IsNull()) },
      select: ['id_usuario', 'usuarioReemplazo'],
      relations: ['usuarioReemplazo'],
    });

    const idsUsuariosYaAsignados = new Set<number>();
    const idsUsuariosConReemplazo = new Set<number>();

    for (const user of usuariosConReemplazo) {
      if (user.usuarioReemplazo) {
        idsUsuariosYaAsignados.add(user.usuarioReemplazo.id_usuario);
        idsUsuariosConReemplazo.add(user.id_usuario);
      }
    }

    const idsExcluidos = new Set<number>([
      idUsuario,
      ...idsUsuariosYaAsignados,
      ...idsUsuariosConReemplazo,
    ]);

    if (usuario.usuarioReemplazo) {
      idsExcluidos.delete(usuario.usuarioReemplazo.id_usuario);
    }

    let grupoReemplazoId = usuario.grupoUsuario.id_grupo_usuario;
    if (grupoReemplazoId === 1) grupoReemplazoId = 2;

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

  /**
   * Retorna al usuario principal que tiene como reemplazo al ID dado.
   */
  async getUsuarioPrincipalPorReemplazo(
    idUsuarioReemplazo: number,
  ): Promise<Usuario | null> {
    const raw = await this.usuarioRepo.query(
      `SELECT * FROM usuario WHERE id_usuario_reemplazo = ? AND tipo = 'votante' AND estado = 1 AND status = 1 LIMIT 1`,
      [idUsuarioReemplazo],
    );

    if (!raw.length) return null;

    return await this.usuarioRepo.findOne({
      where: { id_usuario: raw[0].id_usuario },
      relations: ['grupoUsuario'],
    });
  }

  async generarCodigoUnicoUsuario(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const codigo = this.generarCodigoUsuario();

      try {
        const existe = await this.usuarioRepo.exist({ where: { codigo } });
        if (!existe) return codigo;
      } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          continue; // Intentamos otro código
        }
        throw new InternalServerErrorException(
          'Error al verificar el código de usuario',
        );
      }
    }

    throw new ConflictException(
      'No se pudo generar un código único de usuario',
    );
  }

  // ==============================
  // Métodos privados
  // ==============================

  private generarCodigoUsuario(): string {
    const letras = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    ).join('');

    const numeros = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `U-${letras}${numeros}`;
  }

  /**
   * Procesa un usuario individual: desencripta cédula y elimina contraseña si no se requiere.
   */
  private async processUser(
    user: Usuario,
    keepPassword = false,
  ): Promise<Usuario> {
    if (!user) return null;

    if (user.cedula) {
      const decryptedBytes = CryptoJS.AES.decrypt(
        user.cedula,
        process.env.ENCRYPTION_KEY,
      );
      user.cedula = decryptedBytes.toString(CryptoJS.enc.Utf8) || null;
    }

    if (!keepPassword) delete user.contrasena;

    return user;
  }

  /**
   * Procesa múltiples usuarios (aplica `processUser` a cada uno).
   */
  private async processUsers(users: Usuario[]): Promise<Usuario[]> {
    return Promise.all(users.map((user) => this.processUser(user)));
  }

  private async isCedulaDuplicada(
    cedula: string,
    idUsuarioActual?: number,
  ): Promise<boolean> {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY no está definida en el entorno.');
    }

    const usuarios = await this.usuarioRepo.find();

    for (const user of usuarios) {
      if (!user.cedula) continue; // ⚠️ Salta si no hay cédula almacenada

      // ❗ Ignora el propio usuario si se está editando
      if (idUsuarioActual && user.id_usuario === idUsuarioActual) {
        continue;
      }

      try {
        const decrypted = CryptoJS.AES.decrypt(
          user.cedula,
          encryptionKey,
        ).toString(CryptoJS.enc.Utf8);

        if (decrypted === cedula) {
          return true;
        }
      } catch (e) {
        console.warn(
          `❌ Error al desencriptar cédula del usuario ID ${user.id_usuario}`,
        );
        continue;
      }
    }

    return false;
  }
}
