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
exports.Asistencia = void 0;
const sesion_entity_1 = require("../sesion/sesion.entity");
const usuario_entity_1 = require("../usuario/usuario.entity");
const typeorm_1 = require("typeorm");
let Asistencia = class Asistencia {
};
exports.Asistencia = Asistencia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Asistencia.prototype, "id_asistencia", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sesion_entity_1.Sesion, (sesion) => sesion.asistencias),
    (0, typeorm_1.JoinColumn)({ name: 'id_sesion' }),
    __metadata("design:type", sesion_entity_1.Sesion)
], Asistencia.prototype, "sesion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.asistencias),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Asistencia.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asistencia.prototype, "tipo_asistencia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Asistencia.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Asistencia.prototype, "status", void 0);
exports.Asistencia = Asistencia = __decorate([
    (0, typeorm_1.Entity)()
], Asistencia);
//# sourceMappingURL=asistencia.entity.js.map