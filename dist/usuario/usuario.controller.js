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
exports.UsuarioController = void 0;
const common_1 = require("@nestjs/common");
const usuario_entity_1 = require("./usuario.entity");
const usuario_service_1 = require("./usuario.service");
const auth_guard_1 = require("../auth/auth.guard");
const create_usuario_dto_1 = require("../auth/dto/create-usuario.dto");
let UsuarioController = class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }
    async findAll(query) {
        const relations = query.relations ? query.relations.split(',') : [];
        return this.usuarioService.findAll(relations);
    }
    async findOne(id) {
        return this.usuarioService.findOne(id);
    }
    async findOneBy(query) {
        const relations = query.relations ? query.relations.split(',') : [];
        const filteredQuery = { ...query };
        delete filteredQuery.relations;
        return this.usuarioService.findOneBy(filteredQuery, relations);
    }
    async findAllBy(query) {
        const relations = query.relations ? query.relations.split(',') : [];
        const filteredQuery = { ...query };
        delete filteredQuery.relations;
        return this.usuarioService.findAllBy(filteredQuery, relations);
    }
    async count() {
        return this.usuarioService.count();
    }
    async obtenerReemplazosDisponibles(id) {
        return await this.usuarioService.obtenerReemplazosDisponibles(id);
    }
    async create(createUsuarioDto) {
        return this.usuarioService.createUsuario(createUsuarioDto);
    }
    async save(entity) {
        return await this.usuarioService.updateUsuario(entity);
    }
    async delete(id) {
        return this.usuarioService.deleteUsuario(id);
    }
};
exports.UsuarioController = UsuarioController;
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('find/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('findOneBy'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "findOneBy", null);
__decorate([
    (0, common_1.Get)('findAllBy'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "findAllBy", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "count", null);
__decorate([
    (0, common_1.Get)('reemplazos-disponibles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "obtenerReemplazosDisponibles", null);
__decorate([
    (0, common_1.Post)('save'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('update'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_entity_1.Usuario]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "delete", null);
exports.UsuarioController = UsuarioController = __decorate([
    (0, common_1.Controller)('usuario'),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService])
], UsuarioController);
//# sourceMappingURL=usuario.controller.js.map