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
exports.SesionDocumento = void 0;
const typeorm_1 = require("typeorm");
const documento_entity_1 = require("../documento/documento.entity");
const sesion_entity_1 = require("../sesion/sesion.entity");
let SesionDocumento = class SesionDocumento {
};
exports.SesionDocumento = SesionDocumento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SesionDocumento.prototype, "id_sesion_documento", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sesion_entity_1.Sesion, (sesion) => sesion.sesionDocumentos),
    (0, typeorm_1.JoinColumn)({ name: 'id_sesion' }),
    __metadata("design:type", sesion_entity_1.Sesion)
], SesionDocumento.prototype, "sesion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => documento_entity_1.Documento, (documento) => documento.sesionDocumentos),
    (0, typeorm_1.JoinColumn)({ name: 'id_documento' }),
    __metadata("design:type", documento_entity_1.Documento)
], SesionDocumento.prototype, "documento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SesionDocumento.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SesionDocumento.prototype, "status", void 0);
exports.SesionDocumento = SesionDocumento = __decorate([
    (0, typeorm_1.Entity)()
], SesionDocumento);
//# sourceMappingURL=sesion-documento.entity.js.map