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
exports.PuntoController = void 0;
const common_1 = require("@nestjs/common");
const punto_service_1 = require("./punto.service");
const punto_entity_1 = require("./punto.entity");
const create_punto_dto_1 = require("../auth/dto/create-punto.dto");
const resultado_manual_dto_1 = require("../auth/dto/resultado-manual.dto");
const auth_guard_1 = require("../auth/auth.guard");
let PuntoController = class PuntoController {
    constructor(puntoService) {
        this.puntoService = puntoService;
    }
    async findAll(query) {
        const relations = query.relations ? query.relations.split(',') : [];
        return await this.puntoService.findAll(relations);
    }
    async findOne(id) {
        return await this.puntoService.findOne({ id });
    }
    async findOneBy(query) {
        const relations = query.relations ? query.relations.split(',') : [];
        const filteredQuery = { ...query };
        delete filteredQuery.relations;
        return await this.puntoService.findOneBy(filteredQuery, relations);
    }
    async findAllBy(query) {
        const relations = query.relations ? query.relations.split(',') : [];
        const filteredQuery = { ...query };
        delete filteredQuery.relations;
        return await this.puntoService.findAllBy(filteredQuery, relations);
    }
    async count() {
        return await this.puntoService.count();
    }
    async save(entity) {
        return await this.puntoService.save(entity);
    }
    async saveMany(entities) {
        return await this.puntoService.saveMany(entities);
    }
    async crearPunto(createPuntoDto) {
        return await this.puntoService.crearPunto(createPuntoDto);
    }
    async eliminarPunto(idPunto) {
        return await this.puntoService.eliminarPunto(idPunto);
    }
    async moverPunto(body) {
        return await this.puntoService.reordenarPunto(body.idPunto, body.posicionInicial, body.posicionFinal);
    }
    async calcularResultados(id) {
        await this.puntoService.calcularResultados(id);
        return { message: 'Resultados actualizados correctamente' };
    }
    async registrarResultadoManual(dto) {
        await this.puntoService.calcularResultadosManual(dto);
    }
    async getResultadoPunto(idPunto) {
        return await this.puntoService.getResultadosPunto(idPunto);
    }
};
exports.PuntoController = PuntoController;
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('find/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('findOneBy'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "findOneBy", null);
__decorate([
    (0, common_1.Get)('findAllBy'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "findAllBy", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "count", null);
__decorate([
    (0, common_1.Post)('save'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [punto_entity_1.Punto]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "save", null);
__decorate([
    (0, common_1.Post)('save/many'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "saveMany", null);
__decorate([
    (0, common_1.Post)('crear'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_punto_dto_1.CreatePuntoDto]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "crearPunto", null);
__decorate([
    (0, common_1.Post)('eliminar/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "eliminarPunto", null);
__decorate([
    (0, common_1.Post)('reordenar'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "moverPunto", null);
__decorate([
    (0, common_1.Post)('calcular-resultados/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "calcularResultados", null);
__decorate([
    (0, common_1.Post)('resultado-manual'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resultado_manual_dto_1.ResultadoManualDto]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "registrarResultadoManual", null);
__decorate([
    (0, common_1.Get)('resultado/:idPunto'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('idPunto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntoController.prototype, "getResultadoPunto", null);
exports.PuntoController = PuntoController = __decorate([
    (0, common_1.Controller)('punto'),
    __metadata("design:paramtypes", [punto_service_1.PuntoService])
], PuntoController);
//# sourceMappingURL=punto.controller.js.map