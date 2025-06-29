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
exports.ResolucionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resolucion_entity_1 = require("./resolucion.entity");
const commons_service_1 = require("../commons/commons.service");
let ResolucionService = class ResolucionService extends commons_service_1.BaseService {
    constructor(resolucionRepo, dataSource) {
        super();
        this.resolucionRepo = resolucionRepo;
        this.dataSource = dataSource;
    }
    getRepository() {
        return this.resolucionRepo;
    }
    async actualizarResolucion(dto) {
        const { id_punto, id_usuario, nombre, descripcion, voto_manual } = dto;
        const fecha = new Date();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET @usuario_actual = ?`, [id_usuario]);
            const updateData = { nombre, descripcion, fecha };
            if (voto_manual !== undefined) {
                updateData.voto_manual = voto_manual;
            }
            await queryRunner.manager.update(resolucion_entity_1.Resolucion, id_punto, updateData);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.ResolucionService = ResolucionService;
exports.ResolucionService = ResolucionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resolucion_entity_1.Resolucion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ResolucionService);
//# sourceMappingURL=resolucion.service.js.map