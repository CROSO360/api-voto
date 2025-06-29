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
exports.Documento = void 0;
const typeorm_1 = require("typeorm");
const sesion_documento_entity_1 = require("../sesion-documento/sesion-documento.entity");
const punto_documento_entity_1 = require("../punto-documento/punto-documento.entity");
let Documento = class Documento {
};
exports.Documento = Documento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Documento.prototype, "id_documento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Documento.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Documento.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Documento.prototype, "fecha_subida", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Documento.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Documento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sesion_documento_entity_1.SesionDocumento, (sesionDocumento) => sesionDocumento.sesion),
    __metadata("design:type", Array)
], Documento.prototype, "sesionDocumentos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => punto_documento_entity_1.PuntoDocumento, (puntoDocumento) => puntoDocumento.punto),
    __metadata("design:type", Array)
], Documento.prototype, "puntoDocumentos", void 0);
exports.Documento = Documento = __decorate([
    (0, typeorm_1.Entity)()
], Documento);
//# sourceMappingURL=documento.entity.js.map