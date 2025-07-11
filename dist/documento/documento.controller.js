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
exports.DocumentoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const commons_controller_1 = require("../commons/commons.controller");
const documento_service_1 = require("./documento.service");
const auth_guard_1 = require("../auth/auth.guard");
let DocumentoController = class DocumentoController extends commons_controller_1.BaseController {
    constructor(documentoService) {
        super();
        this.documentoService = documentoService;
    }
    getService() {
        return this.documentoService;
    }
    subirDocumento(file) {
        return this.documentoService.subirDocumento(file);
    }
    async eliminarDocumento(id) {
        return this.documentoService.eliminarDocumento(id);
    }
};
exports.DocumentoController = DocumentoController;
__decorate([
    (0, common_1.Post)('subir'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentoController.prototype, "subirDocumento", null);
__decorate([
    (0, common_1.Delete)('eliminar/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentoController.prototype, "eliminarDocumento", null);
exports.DocumentoController = DocumentoController = __decorate([
    (0, common_1.Controller)('documento'),
    __metadata("design:paramtypes", [documento_service_1.DocumentoService])
], DocumentoController);
//# sourceMappingURL=documento.controller.js.map