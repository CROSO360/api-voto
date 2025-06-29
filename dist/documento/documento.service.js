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
exports.DocumentoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path = require("path");
const fs = require("fs");
const documento_entity_1 = require("./documento.entity");
const commons_service_1 = require("../commons/commons.service");
let DocumentoService = class DocumentoService extends commons_service_1.BaseService {
    constructor(documentoRepo) {
        super();
        this.documentoRepo = documentoRepo;
    }
    getRepository() {
        return this.documentoRepo;
    }
    async subirDocumento(file) {
        if (!file) {
            throw new common_1.BadRequestException('No se ha recibido ningún archivo');
        }
        const fileUrl = `${process.env.APP_BASE_URL}/subidas/${file.filename}`;
        const nuevoDocumento = this.documentoRepo.create({
            nombre: file.originalname,
            url: fileUrl,
            fecha_subida: new Date(),
            estado: true,
            status: true,
        });
        return await this.documentoRepo.save(nuevoDocumento);
    }
    async eliminarDocumento(id) {
        const documento = await this.documentoRepo.findOne({
            where: { id_documento: id },
        });
        if (!documento) {
            throw new common_1.NotFoundException(`Documento con ID ${id} no encontrado.`);
        }
        const filePath = path.join(process.cwd(), 'uploads', path.basename(documento.url));
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            else {
                console.warn(`Archivo no encontrado en ${filePath}, pero se eliminará el registro de BD.`);
            }
            await this.documentoRepo.remove(documento);
            return {
                message: `Documento "${documento.nombre}" eliminado correctamente.`,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al eliminar el documento.');
        }
    }
};
exports.DocumentoService = DocumentoService;
exports.DocumentoService = DocumentoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(documento_entity_1.Documento)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentoService);
//# sourceMappingURL=documento.service.js.map