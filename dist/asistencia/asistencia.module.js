"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsistenciaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asistencia_controller_1 = require("./asistencia.controller");
const asistencia_service_1 = require("./asistencia.service");
const asistencia_entity_1 = require("./asistencia.entity");
const sesion_entity_1 = require("../sesion/sesion.entity");
const miembro_entity_1 = require("../miembro/miembro.entity");
let AsistenciaModule = class AsistenciaModule {
};
exports.AsistenciaModule = AsistenciaModule;
exports.AsistenciaModule = AsistenciaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([asistencia_entity_1.Asistencia, sesion_entity_1.Sesion, miembro_entity_1.Miembro]),
        ],
        providers: [asistencia_service_1.AsistenciaService],
        controllers: [asistencia_controller_1.AsistenciaController],
    })
], AsistenciaModule);
//# sourceMappingURL=asistencia.module.js.map