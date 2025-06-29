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
exports.SesionController = void 0;
const common_1 = require("@nestjs/common");
const sesion_service_1 = require("./sesion.service");
const commons_controller_1 = require("../commons/commons.controller");
let SesionController = class SesionController extends commons_controller_1.BaseController {
    constructor(sesionService) {
        super();
        this.sesionService = sesionService;
    }
    getService() {
        return this.sesionService;
    }
    async generarReporte(id, res) {
        try {
            const buffer = await this.sesionService.generarReporteSesion(id);
            const timestamp = new Date()
                .toISOString()
                .replace(/[-:]/g, '')
                .replace(/\..+/, '')
                .replace('T', '_');
            const nombreArchivo = `reporte_sesion_${id}_${timestamp}.pdf`;
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${nombreArchivo}`,
                'Content-Length': buffer.length,
            });
            res.send(buffer);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Error generando el reporte PDF');
        }
    }
};
exports.SesionController = SesionController;
__decorate([
    (0, common_1.Get)('reporte/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "generarReporte", null);
exports.SesionController = SesionController = __decorate([
    (0, common_1.Controller)('sesion'),
    __metadata("design:paramtypes", [sesion_service_1.SesionService])
], SesionController);
//# sourceMappingURL=sesion.controller.js.map