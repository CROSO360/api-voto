"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrupoUsuarioModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const grupo_usuario_entity_1 = require("./grupo-usuario.entity");
const grupo_usuario_service_1 = require("./grupo-usuario.service");
const grupo_usuario_controller_1 = require("./grupo-usuario.controller");
let GrupoUsuarioModule = class GrupoUsuarioModule {
};
exports.GrupoUsuarioModule = GrupoUsuarioModule;
exports.GrupoUsuarioModule = GrupoUsuarioModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([grupo_usuario_entity_1.GrupoUsuario])],
        providers: [grupo_usuario_service_1.GrupoUsuarioService],
        controllers: [grupo_usuario_controller_1.GrupoUsuarioController],
        exports: [grupo_usuario_service_1.GrupoUsuarioService]
    })
], GrupoUsuarioModule);
//# sourceMappingURL=grupo-usuario.module.js.map