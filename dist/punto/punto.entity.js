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
exports.Punto = void 0;
const typeorm_1 = require("typeorm");
const sesion_entity_1 = require("../sesion/sesion.entity");
const resolucion_entity_1 = require("../resolucion/resolucion.entity");
const punto_usuario_entity_1 = require("../punto-usuario/punto-usuario.entity");
const punto_documento_entity_1 = require("../punto-documento/punto-documento.entity");
let Punto = class Punto {
};
exports.Punto = Punto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Punto.prototype, "id_punto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sesion_entity_1.Sesion, sesion => sesion.puntos),
    (0, typeorm_1.JoinColumn)({ name: 'id_sesion' }),
    __metadata("design:type", sesion_entity_1.Sesion)
], Punto.prototype, "sesion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Punto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Punto.prototype, "detalle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Punto.prototype, "orden", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Punto.prototype, "es_administrativa", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Punto.prototype, "n_afavor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Punto.prototype, "p_afavor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Punto.prototype, "n_encontra", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Punto.prototype, "p_encontra", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Punto.prototype, "n_abstencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Punto.prototype, "p_abstencion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Punto.prototype, "resultado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Punto.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Punto.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => punto_usuario_entity_1.PuntoUsuario, puntoUsuario => puntoUsuario.punto),
    __metadata("design:type", Array)
], Punto.prototype, "puntoUsuarios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => punto_documento_entity_1.PuntoDocumento, puntoDocumento => puntoDocumento.punto),
    __metadata("design:type", Array)
], Punto.prototype, "puntoDocumentos", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => resolucion_entity_1.Resolucion, resolucion => resolucion.punto),
    __metadata("design:type", resolucion_entity_1.Resolucion)
], Punto.prototype, "resolucion", void 0);
exports.Punto = Punto = __decorate([
    (0, typeorm_1.Entity)()
], Punto);
//# sourceMappingURL=punto.entity.js.map