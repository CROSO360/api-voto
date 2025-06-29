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
exports.AsistenciaController = void 0;
const common_1 = require("@nestjs/common");
const asistencia_service_1 = require("./asistencia.service");
const commons_controller_1 = require("../commons/commons.controller");
let AsistenciaController = class AsistenciaController extends commons_controller_1.BaseController {
    constructor(asistenciaService) {
        super();
        this.asistenciaService = asistenciaService;
    }
    getService() {
        return this.asistenciaService;
    }
    generarAsistencias(idSesion) {
        return this.asistenciaService.generarAsistencias(+idSesion);
    }
    sincronizarAsistencias(idSesion, body) {
        return this.asistenciaService.sincronizarAsistencias(+idSesion, body.usuariosSeleccionados);
    }
    eliminarAsistencias(idSesion) {
        return this.asistenciaService.eliminarAsistencias(+idSesion);
    }
};
exports.AsistenciaController = AsistenciaController;
__decorate([
    (0, common_1.Post)('generar/:idSesion'),
    __param(0, (0, common_1.Param)('idSesion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AsistenciaController.prototype, "generarAsistencias", null);
__decorate([
    (0, common_1.Post)('sincronizar/:idSesion'),
    __param(0, (0, common_1.Param)('idSesion')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AsistenciaController.prototype, "sincronizarAsistencias", null);
__decorate([
    (0, common_1.Post)('eliminar/:idSesion'),
    __param(0, (0, common_1.Param)('idSesion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AsistenciaController.prototype, "eliminarAsistencias", null);
exports.AsistenciaController = AsistenciaController = __decorate([
    (0, common_1.Controller)('asistencia'),
    __metadata("design:paramtypes", [asistencia_service_1.AsistenciaService])
], AsistenciaController);
//# sourceMappingURL=asistencia.controller.js.map