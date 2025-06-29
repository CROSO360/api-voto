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
exports.Resolucion = void 0;
const typeorm_1 = require("typeorm");
const punto_entity_1 = require("../punto/punto.entity");
const auditoria_entity_1 = require("../auditoria/auditoria.entity");
let Resolucion = class Resolucion {
};
exports.Resolucion = Resolucion;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Resolucion.prototype, "id_punto", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => punto_entity_1.Punto, punto => punto.resolucion),
    (0, typeorm_1.JoinColumn)({ name: 'id_punto' }),
    __metadata("design:type", punto_entity_1.Punto)
], Resolucion.prototype, "punto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Resolucion.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Resolucion.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Resolucion.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Resolucion.prototype, "voto_manual", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Resolucion.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Resolucion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => auditoria_entity_1.Auditoria, auditoria => auditoria.resolucion),
    __metadata("design:type", Array)
], Resolucion.prototype, "auditorias", void 0);
exports.Resolucion = Resolucion = __decorate([
    (0, typeorm_1.Entity)()
], Resolucion);
//# sourceMappingURL=resolucion.entity.js.map