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
exports.Sesion = void 0;
const typeorm_1 = require("typeorm");
const asistencia_entity_1 = require("../asistencia/asistencia.entity");
const punto_entity_1 = require("../punto/punto.entity");
const sesion_documento_entity_1 = require("../sesion-documento/sesion-documento.entity");
let Sesion = class Sesion {
};
exports.Sesion = Sesion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sesion.prototype, "id_sesion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sesion.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sesion.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Sesion.prototype, "fecha_inicio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Sesion.prototype, "fecha_fin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sesion.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sesion.prototype, "fase", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Sesion.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Sesion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => punto_entity_1.Punto, punto => punto.sesion),
    __metadata("design:type", Array)
], Sesion.prototype, "puntos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asistencia_entity_1.Asistencia, asistencia => asistencia.sesion),
    __metadata("design:type", Array)
], Sesion.prototype, "asistencias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sesion_documento_entity_1.SesionDocumento, sesionDocumento => sesionDocumento.sesion),
    __metadata("design:type", Array)
], Sesion.prototype, "sesionDocumentos", void 0);
exports.Sesion = Sesion = __decorate([
    (0, typeorm_1.Entity)()
], Sesion);
//# sourceMappingURL=sesion.entity.js.map