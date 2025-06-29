"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntoUsuarioModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const punto_usuario_entity_1 = require("./punto-usuario.entity");
const punto_usuario_service_1 = require("./punto-usuario.service");
const punto_usuario_controller_1 = require("./punto-usuario.controller");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const sesion_module_1 = require("../sesion/sesion.module");
const punto_entity_1 = require("../punto/punto.entity");
const miembro_entity_1 = require("../miembro/miembro.entity");
let PuntoUsuarioModule = class PuntoUsuarioModule {
};
exports.PuntoUsuarioModule = PuntoUsuarioModule;
exports.PuntoUsuarioModule = PuntoUsuarioModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([punto_usuario_entity_1.PuntoUsuario, punto_entity_1.Punto, miembro_entity_1.Miembro]),
            sesion_module_1.SesionModule,
        ],
        providers: [
            punto_usuario_service_1.PuntoUsuarioService,
            websocket_gateway_1.WebsocketGateway,
        ],
        controllers: [punto_usuario_controller_1.PuntoUsuarioController],
        exports: [
            punto_usuario_service_1.PuntoUsuarioService,
            typeorm_1.TypeOrmModule.forFeature([punto_usuario_entity_1.PuntoUsuario]),
        ],
    })
], PuntoUsuarioModule);
//# sourceMappingURL=punto-usuario.module.js.map