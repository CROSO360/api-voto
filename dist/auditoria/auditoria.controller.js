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
exports.AuditoriaController = void 0;
const common_1 = require("@nestjs/common");
const commons_controller_1 = require("../commons/commons.controller");
const auditoria_service_1 = require("./auditoria.service");
let AuditoriaController = class AuditoriaController extends commons_controller_1.BaseController {
    constructor(auditoriaService) {
        super();
        this.auditoriaService = auditoriaService;
    }
    getService() {
        return this.auditoriaService;
    }
};
exports.AuditoriaController = AuditoriaController;
exports.AuditoriaController = AuditoriaController = __decorate([
    (0, common_1.Controller)('auditoria'),
    __metadata("design:paramtypes", [auditoria_service_1.AuditoriaService])
], AuditoriaController);
//# sourceMappingURL=auditoria.controller.js.map