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
exports.GrupoUsuario = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../usuario/usuario.entity");
let GrupoUsuario = class GrupoUsuario {
};
exports.GrupoUsuario = GrupoUsuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GrupoUsuario.prototype, "id_grupo_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GrupoUsuario.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], GrupoUsuario.prototype, "peso", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], GrupoUsuario.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], GrupoUsuario.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_entity_1.Usuario, usuario => usuario.grupoUsuario),
    __metadata("design:type", Array)
], GrupoUsuario.prototype, "usuarios", void 0);
exports.GrupoUsuario = GrupoUsuario = __decorate([
    (0, typeorm_1.Entity)()
], GrupoUsuario);
//# sourceMappingURL=grupo-usuario.entity.js.map