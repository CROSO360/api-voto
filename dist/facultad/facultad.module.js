"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultadModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const facultad_entity_1 = require("./facultad.entity");
const facultad_service_1 = require("./facultad.service");
const facultad_controller_1 = require("./facultad.controller");
let FacultadModule = class FacultadModule {
};
exports.FacultadModule = FacultadModule;
exports.FacultadModule = FacultadModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([facultad_entity_1.Facultad])],
        providers: [facultad_service_1.FacultadService],
        controllers: [facultad_controller_1.FacultadController],
        exports: [facultad_service_1.FacultadService],
    })
], FacultadModule);
//# sourceMappingURL=facultad.module.js.map