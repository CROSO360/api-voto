"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const CryptoJS = require("crypto-js");
let UsuarioService = class UsuarioService {
    constructor(usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }
    async findAll(relations = []) {
        const options = relations.length ? { relations } : {};
        const users = await this.usuarioRepo.find(options);
        return this.processUsers(users);
    }
    async findOne(id, relations = []) {
        const options = relations.length
            ? { where: { id_usuario: id }, relations }
            : { where: { id_usuario: id } };
        const user = await this.usuarioRepo.findOne(options);
        return this.processUser(user);
    }
    async findOneBy(query, relations = []) {
        const options = {
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
    async findAllBy(query, relations = []) {
        const options = relations.length
            ? { where: query, relations }
            : { where: query };
        const users = await this.usuarioRepo.find(options);
        return this.processUsers(users);
    }
    async createUsuario(createUsuarioDto) {
        const usuario = this.usuarioRepo.create(createUsuarioDto);
        return this.usuarioRepo.save(usuario);
    }
    async updateUsuario(entity) {
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
        if (entity.cedula && entity.cedula !== existingUser.cedula) {
            entity.cedula = CryptoJS.AES.encrypt(entity.cedula, encryptionKey).toString();
        }
        else {
            entity.cedula = existingUser.cedula;
        }
        return await this.usuarioRepo.save(entity);
    }
    async deleteUsuario(id) {
        await this.usuarioRepo.delete(id);
    }
    async count() {
        return this.usuarioRepo.count();
    }
    async obtenerReemplazosDisponibles(idUsuario) {
        const usuario = await this.usuarioRepo.findOne({
            where: { id_usuario: idUsuario },
            relations: ['grupoUsuario', 'usuarioReemplazo'],
        });
        if (!usuario)
            throw new Error('Usuario no encontrado');
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
            where: { usuarioReemplazo: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
            select: ['id_usuario', 'usuarioReemplazo'],
            relations: ['usuarioReemplazo'],
        });
        const idsUsuariosYaAsignados = new Set();
        const idsUsuariosConReemplazo = new Set();
        for (const user of usuariosConReemplazo) {
            if (user.usuarioReemplazo) {
                idsUsuariosYaAsignados.add(user.usuarioReemplazo.id_usuario);
                idsUsuariosConReemplazo.add(user.id_usuario);
            }
        }
        const idsExcluidos = new Set([
            idUsuario,
            ...idsUsuariosYaAsignados,
            ...idsUsuariosConReemplazo,
        ]);
        if (usuario.usuarioReemplazo) {
            idsExcluidos.delete(usuario.usuarioReemplazo.id_usuario);
        }
        let grupoReemplazoId = usuario.grupoUsuario.id_grupo_usuario;
        if (grupoReemplazoId === 1)
            grupoReemplazoId = 2;
        const disponibles = await this.usuarioRepo.find({
            where: {
                grupoUsuario: { id_grupo_usuario: grupoReemplazoId },
                id_usuario: (0, typeorm_2.Not)((0, typeorm_2.In)([...idsExcluidos])),
            },
            relations: ['grupoUsuario'],
        });
        return {
            disponibles: await Promise.all(disponibles.map((user) => this.processUser(user))),
            reemplazo: tieneReemplazo,
            esReemplazoDe: esReemplazoDe,
        };
    }
    async getUsuarioPrincipalPorReemplazo(idUsuarioReemplazo) {
        const raw = await this.usuarioRepo.query(`SELECT * FROM usuario WHERE id_usuario_reemplazo = ? AND tipo = 'votante' AND estado = 1 AND status = 1 LIMIT 1`, [idUsuarioReemplazo]);
        if (!raw.length)
            return null;
        return await this.usuarioRepo.findOne({
            where: { id_usuario: raw[0].id_usuario },
            relations: ['grupoUsuario'],
        });
    }
    async processUser(user, keepPassword = false) {
        if (!user)
            return null;
        if (user.cedula) {
            const decryptedBytes = CryptoJS.AES.decrypt(user.cedula, process.env.ENCRYPTION_KEY);
            user.cedula = decryptedBytes.toString(CryptoJS.enc.Utf8) || null;
        }
        if (!keepPassword)
            delete user.contrasena;
        return user;
    }
    async processUsers(users) {
        return Promise.all(users.map((user) => this.processUser(user)));
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuarioService);
//# sourceMappingURL=usuario.service.js.map