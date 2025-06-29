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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesionDocumentoController = void 0;
const common_1 = require("@nestjs/common");
const sesion_documento_service_1 = require("./sesion-documento.service");
const commons_controller_1 = require("../commons/commons.controller");
let SesionDocumentoController = class SesionDocumentoController extends commons_controller_1.BaseController {
    constructor(sesionDocumentoService) {
        super();
        this.sesionDocumentoService = sesionDocumentoService;
    }
    getService() {
        return this.sesionDocumentoService;
    }
};
exports.SesionDocumentoController = SesionDocumentoController;
exports.SesionDocumentoController = SesionDocumentoController = __decorate([
    (0, common_1.Controller)('sesion-documento'),
    __metadata("design:paramtypes", [sesion_documento_service_1.SesionDocumentoService])
], SesionDocumentoController);
//# sourceMappingURL=sesion-documento.controller.js.map