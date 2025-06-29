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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntoUsuarioController = void 0;
const common_1 = require("@nestjs/common");
const punto_usuario_service_1 = require("./punto-usuario.service");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const commons_controller_1 = require("../commons/commons.controller");
const auth_guard_1 = require("../auth/auth.guard");
const voto_dto_1 = require("../auth/dto/voto.dto");
let PuntoUsuarioController = class PuntoUsuarioController extends commons_controller_1.BaseController {
    constructor(puntoUsuarioService, websocketGateway) {
        super();
        this.puntoUsuarioService = puntoUsuarioService;
        this.websocketGateway = websocketGateway;
    }
    getService() {
        return this.puntoUsuarioService;
    }
    async generarPorSesion(idSesion) {
        return this.puntoUsuarioService.generarVotacionesPorSesion(idSesion);
    }
    async eliminarPorSesion(idSesion) {
        return this.puntoUsuarioService.eliminarVotacionesPorSesion(idSesion);
    }
    async voto(votoDto) {
        const idPU = await this.puntoUsuarioService.validarVoto(votoDto.codigo, votoDto.id_usuario, votoDto.punto, votoDto.opcion, votoDto.es_razonado, votoDto.votante);
        this.websocketGateway.emitChange(idPU);
    }
    async cambiarPrincipalAlterno(idSesion, idUsuario) {
        await this.puntoUsuarioService.cambiarPrincipalAlterno(idSesion, idUsuario);
    }
};
exports.PuntoUsuarioController = PuntoUsuarioController;
__decorate([
    (0, common_1.Post)('generar-puntovoto/:idSesion'),
    __param(0, (0, common_1.Param)('idSesion', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntoUsuarioController.prototype, "generarPorSesion", null);
__decorate([
    (0, common_1.Post)('eliminar-puntovoto/:idSesion'),
    __param(0, (0, common_1.Param)('idSesion', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntoUsuarioController.prototype, "eliminarPorSesion", null);
__decorate([
    (0, common_1.Post)('voto'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [voto_dto_1.VotoDto]),
    __metadata("design:returntype", Promise)
], PuntoUsuarioController.prototype, "voto", null);
__decorate([
    (0, common_1.Post)('cambiar-principal-alterno'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)('id_sesion', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('id_usuario', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PuntoUsuarioController.prototype, "cambiarPrincipalAlterno", null);
exports.PuntoUsuarioController = PuntoUsuarioController = __decorate([
    (0, common_1.Controller)('punto-usuario'),
    __metadata("design:paramtypes", [punto_usuario_service_1.PuntoUsuarioService,
        websocket_gateway_1.WebsocketGateway])
], PuntoUsuarioController);
//# sourceMappingURL=punto-usuario.controller.js.map