"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sesion_entity_1 = require("./sesion.entity");
const punto_entity_1 = require("../punto/punto.entity");
const punto_usuario_entity_1 = require("../punto-usuario/punto-usuario.entity");
const documento_entity_1 = require("../documento/documento.entity");
const sesion_documento_entity_1 = require("../sesion-documento/sesion-documento.entity");
const sesion_service_1 = require("./sesion.service");
const sesion_controller_1 = require("./sesion.controller");
const documento_module_1 = require("../documento/documento.module");
const sesion_documento_module_1 = require("../sesion-documento/sesion-documento.module");
let SesionModule = class SesionModule {
};
exports.SesionModule = SesionModule;
exports.SesionModule = SesionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                sesion_entity_1.Sesion,
                punto_entity_1.Punto,
                punto_usuario_entity_1.PuntoUsuario,
                documento_entity_1.Documento,
                sesion_documento_entity_1.SesionDocumento,
            ]),
            documento_module_1.DocumentoModule,
            sesion_documento_module_1.SesionDocumentoModule,
        ],
        providers: [
            sesion_service_1.SesionService,
        ],
        controllers: [
            sesion_controller_1.SesionController,
        ],
        exports: [
            sesion_service_1.SesionService,
            typeorm_1.TypeOrmModule.forFeature([sesion_entity_1.Sesion]),
        ],
    })
], SesionModule);
//# sourceMappingURL=sesion.module.js.map