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
exports.PuntoUsuario = void 0;
const typeorm_1 = require("typeorm");
const punto_entity_1 = require("../punto/punto.entity");
const usuario_entity_1 = require("../usuario/usuario.entity");
let PuntoUsuario = class PuntoUsuario {
};
exports.PuntoUsuario = PuntoUsuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PuntoUsuario.prototype, "id_punto_usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => punto_entity_1.Punto, punto => punto.puntoUsuarios),
    (0, typeorm_1.JoinColumn)({ name: 'id_punto' }),
    __metadata("design:type", punto_entity_1.Punto)
], PuntoUsuario.prototype, "punto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, usuario => usuario.puntoUsuarios),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], PuntoUsuario.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PuntoUsuario.prototype, "opcion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], PuntoUsuario.prototype, "es_razonado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, votante => votante.votosEmitidos),
    (0, typeorm_1.JoinColumn)({ name: 'votante' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], PuntoUsuario.prototype, "votante", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], PuntoUsuario.prototype, "es_principal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], PuntoUsuario.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], PuntoUsuario.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], PuntoUsuario.prototype, "status", void 0);
exports.PuntoUsuario = PuntoUsuario = __decorate([
    (0, typeorm_1.Entity)()
], PuntoUsuario);
//# sourceMappingURL=punto-usuario.entity.js.map