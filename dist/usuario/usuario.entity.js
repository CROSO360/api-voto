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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
const grupo_usuario_entity_1 = require("../grupo-usuario/grupo-usuario.entity");
const facultad_entity_1 = require("../facultad/facultad.entity");
const punto_usuario_entity_1 = require("../punto-usuario/punto-usuario.entity");
const asistencia_entity_1 = require("../asistencia/asistencia.entity");
const miembro_entity_1 = require("../miembro/miembro.entity");
const auditoria_entity_1 = require("../auditoria/auditoria.entity");
let Usuario = class Usuario {
    async hashFields() {
        const encryptionKey = process.env.ENCRYPTION_KEY;
        if (!encryptionKey) {
            throw new Error("ENCRYPTION_KEY no está definida en el entorno.");
        }
        if (this.contrasena) {
            this.contrasena = await bcrypt.hash(this.contrasena, 10);
        }
        if (this.cedula) {
            this.cedula = CryptoJS.AES.encrypt(this.cedula, encryptionKey).toString();
        }
    }
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "cedula", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "contrasena", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Usuario.prototype, "es_reemplazo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Usuario.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Usuario.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => grupo_usuario_entity_1.GrupoUsuario, (grupoUsuario) => grupoUsuario.usuarios),
    (0, typeorm_1.JoinColumn)({ name: 'id_grupo_usuario' }),
    __metadata("design:type", grupo_usuario_entity_1.GrupoUsuario)
], Usuario.prototype, "grupoUsuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario, (usuario) => usuario.usuarioReemplazo),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_reemplazo' }),
    __metadata("design:type", Usuario)
], Usuario.prototype, "usuarioReemplazo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => facultad_entity_1.Facultad, (facultad) => facultad.usuarios),
    (0, typeorm_1.JoinColumn)({ name: 'id_facultad' }),
    __metadata("design:type", facultad_entity_1.Facultad)
], Usuario.prototype, "facultad", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asistencia_entity_1.Asistencia, (asistencia) => asistencia.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "asistencias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => punto_usuario_entity_1.PuntoUsuario, (puntoUsuario) => puntoUsuario.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "puntoUsuarios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => punto_usuario_entity_1.PuntoUsuario, (puntoUsuario) => puntoUsuario.votante),
    __metadata("design:type", Array)
], Usuario.prototype, "votosEmitidos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => miembro_entity_1.Miembro, (miembro) => miembro.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "miembros", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => auditoria_entity_1.Auditoria, (auditoria) => auditoria.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "auditorias", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Usuario.prototype, "hashFields", null);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)()
], Usuario);
//# sourceMappingURL=usuario.entity.js.map