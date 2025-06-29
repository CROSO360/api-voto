"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntoDocumentoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const punto_documento_entity_1 = require("./punto-documento.entity");
const punto_documento_service_1 = require("./punto-documento.service");
const punto_documento_controller_1 = require("./punto-documento.controller");
let PuntoDocumentoModule = class PuntoDocumentoModule {
};
exports.PuntoDocumentoModule = PuntoDocumentoModule;
exports.PuntoDocumentoModule = PuntoDocumentoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([punto_documento_entity_1.PuntoDocumento])
        ],
        providers: [punto_documento_service_1.PuntoDocumentoService],
        controllers: [punto_documento_controller_1.PuntoDocumentoController],
        exports: [punto_documento_service_1.PuntoDocumentoService]
    })
], PuntoDocumentoModule);
//# sourceMappingURL=punto-documento.module.js.map