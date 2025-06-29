"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesionDocumentoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sesion_documento_service_1 = require("./sesion-documento.service");
const sesion_documento_controller_1 = require("./sesion-documento.controller");
const sesion_documento_entity_1 = require("./sesion-documento.entity");
let SesionDocumentoModule = class SesionDocumentoModule {
};
exports.SesionDocumentoModule = SesionDocumentoModule;
exports.SesionDocumentoModule = SesionDocumentoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sesion_documento_entity_1.SesionDocumento])],
        providers: [sesion_documento_service_1.SesionDocumentoService],
        controllers: [sesion_documento_controller_1.SesionDocumentoController],
        exports: [sesion_documento_service_1.SesionDocumentoService],
    })
], SesionDocumentoModule);
//# sourceMappingURL=sesion-documento.module.js.map