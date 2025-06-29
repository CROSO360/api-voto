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
exports.AsistenciaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const commons_service_1 = require("../commons/commons.service");
const asistencia_entity_1 = require("./asistencia.entity");
const sesion_entity_1 = require("../sesion/sesion.entity");
const miembro_entity_1 = require("../miembro/miembro.entity");
let AsistenciaService = class AsistenciaService extends commons_service_1.BaseService {
    constructor(asistenciaRepo, sesionRepo, miembroRepo) {
        super();
        this.asistenciaRepo = asistenciaRepo;
        this.sesionRepo = sesionRepo;
        this.miembroRepo = miembroRepo;
    }
    getRepository() {
        return this.asistenciaRepo;
    }
    async generarAsistencias(idSesion) {
        const sesion = await this.sesionRepo.findOne({ where: { id_sesion: idSesion } });
        if (!sesion)
            throw new common_1.BadRequestException('La sesión no existe.');
        const miembros = await this.miembroRepo.find({
            where: { estado: true, status: true },
            relations: ['usuario'],
        });
        if (!miembros.length)
            throw new common_1.BadRequestException('No hay miembros registrados para generar asistencias.');
        const nuevasAsistencias = [];
        for (const miembro of miembros) {
            const yaExiste = await this.asistenciaRepo.findOne({
                where: {
                    sesion: { id_sesion: idSesion },
                    usuario: { id_usuario: miembro.usuario.id_usuario },
                },
                relations: ['sesion', 'usuario'],
            });
            if (!yaExiste) {
                const asistencia = this.asistenciaRepo.create({
                    sesion,
                    usuario: miembro.usuario,
                    tipo_asistencia: null,
                    estado: true,
                    status: true,
                });
                nuevasAsistencias.push(asistencia);
            }
        }
        return await this.asistenciaRepo.save(nuevasAsistencias);
    }
    async sincronizarAsistencias(idSesion, usuariosSeleccionados) {
        const sesion = await this.sesionRepo.findOne({ where: { id_sesion: idSesion } });
        if (!sesion)
            throw new common_1.BadRequestException('La sesión no existe.');
        const miembros = await this.miembroRepo.find({
            where: { estado: true, status: true },
            relations: ['usuario'],
        });
        const idsMiembros = miembros.map((m) => m.usuario.id_usuario);
        const asistencias = await this.asistenciaRepo.find({
            where: { sesion: { id_sesion: idSesion } },
            relations: ['usuario'],
        });
        const idsAsistentesActuales = asistencias.map((a) => a.usuario.id_usuario);
        for (const asistencia of asistencias) {
            const idUsuario = asistencia.usuario.id_usuario;
            if (!usuariosSeleccionados.includes(idUsuario) &&
                !idsMiembros.includes(idUsuario)) {
                await this.asistenciaRepo.delete(asistencia.id_asistencia);
            }
        }
        for (const idUsuario of usuariosSeleccionados) {
            if (!idsAsistentesActuales.includes(idUsuario) &&
                !idsMiembros.includes(idUsuario)) {
                const asistencia = this.asistenciaRepo.create({
                    sesion,
                    usuario: { id_usuario: idUsuario },
                    tipo_asistencia: null,
                    estado: true,
                    status: true,
                });
                await this.asistenciaRepo.save(asistencia);
            }
        }
    }
    async eliminarAsistencias(idSesion) {
        const sesion = await this.sesionRepo.findOne({ where: { id_sesion: idSesion } });
        if (!sesion)
            throw new common_1.BadRequestException('La sesión no existe.');
        await this.asistenciaRepo.delete({ sesion: { id_sesion: idSesion } });
    }
};
exports.AsistenciaService = AsistenciaService;
exports.AsistenciaService = AsistenciaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asistencia_entity_1.Asistencia)),
    __param(1, (0, typeorm_1.InjectRepository)(sesion_entity_1.Sesion)),
    __param(2, (0, typeorm_1.InjectRepository)(miembro_entity_1.Miembro)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AsistenciaService);
//# sourceMappingURL=asistencia.service.js.map