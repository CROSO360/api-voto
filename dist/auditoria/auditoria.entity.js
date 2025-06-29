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
exports.Auditoria = void 0;
const resolucion_entity_1 = require("../resolucion/resolucion.entity");
const usuario_entity_1 = require("../usuario/usuario.entity");
const typeorm_1 = require("typeorm");
let Auditoria = class Auditoria {
};
exports.Auditoria = Auditoria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Auditoria.prototype, "id_auditoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resolucion_entity_1.Resolucion, (resolucion) => resolucion.auditorias),
    (0, typeorm_1.JoinColumn)({ name: 'id_punto' }),
    __metadata("design:type", resolucion_entity_1.Resolucion)
], Auditoria.prototype, "resolucion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.auditorias),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Auditoria.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Auditoria.prototype, "fecha_anterior", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Auditoria.prototype, "nombre_anterior", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Auditoria.prototype, "descripcion_anterior", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Auditoria.prototype, "voto_manual_anterior", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Auditoria.prototype, "fecha_actual", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Auditoria.prototype, "nombre_actual", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Auditoria.prototype, "descripcion_actual", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Auditoria.prototype, "voto_manual_actual", void 0);
exports.Auditoria = Auditoria = __decorate([
    (0, typeorm_1.Entity)()
], Auditoria);
//# sourceMappingURL=auditoria.entity.js.map