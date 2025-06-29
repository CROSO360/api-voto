"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolucionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const resolucion_entity_1 = require("./resolucion.entity");
const resolucion_service_1 = require("./resolucion.service");
const resolucion_controller_1 = require("./resolucion.controller");
const punto_module_1 = require("../punto/punto.module");
let ResolucionModule = class ResolucionModule {
};
exports.ResolucionModule = ResolucionModule;
exports.ResolucionModule = ResolucionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([resolucion_entity_1.Resolucion]),
            (0, common_1.forwardRef)(() => punto_module_1.PuntoModule),
        ],
        providers: [resolucion_service_1.ResolucionService],
        controllers: [resolucion_controller_1.ResolucionController],
        exports: [resolucion_service_1.ResolucionService, typeorm_1.TypeOrmModule.forFeature([resolucion_entity_1.Resolucion])],
    })
], ResolucionModule);
//# sourceMappingURL=resolucion.module.js.map