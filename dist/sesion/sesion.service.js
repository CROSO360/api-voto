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
exports.SesionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");
const sesion_entity_1 = require("./sesion.entity");
const punto_entity_1 = require("../punto/punto.entity");
const punto_usuario_entity_1 = require("../punto-usuario/punto-usuario.entity");
const documento_entity_1 = require("../documento/documento.entity");
const sesion_documento_entity_1 = require("../sesion-documento/sesion-documento.entity");
const commons_service_1 = require("../commons/commons.service");
let SesionService = class SesionService extends commons_service_1.BaseService {
    constructor(sesionRepo, puntoRepo, puntoUsuarioRepo, documentoRepo, sesionDocumentoRepo) {
        super();
        this.sesionRepo = sesionRepo;
        this.puntoRepo = puntoRepo;
        this.puntoUsuarioRepo = puntoUsuarioRepo;
        this.documentoRepo = documentoRepo;
        this.sesionDocumentoRepo = sesionDocumentoRepo;
    }
    getRepository() {
        return this.sesionRepo;
    }
    async generarReporteSesion(idSesion) {
        const sesion = await this.sesionRepo.findOne({
            where: { id_sesion: idSesion },
            relations: ['puntos', 'puntos.resolucion'],
        });
        if (!sesion) {
            throw new common_1.BadRequestException('Sesión no encontrada');
        }
        if (sesion.fase !== 'finalizada') {
            throw new common_1.BadRequestException('La sesión no está finalizada');
        }
        const fonts = {
            Roboto: {
                normal: path.join(__dirname, '..', '..', 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(__dirname, '..', '..', 'fonts', 'Roboto-Medium.ttf'),
                italics: path.join(__dirname, '..', '..', 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '..', '..', 'fonts', 'Roboto-MediumItalic.ttf'),
            },
        };
        const printer = new PdfPrinter(fonts);
        const content = [
            { text: `Resultados de la sesión ${sesion.nombre}`, style: 'header' },
        ];
        for (const punto of sesion.puntos) {
            const resolucion = punto.resolucion;
            content.push({ text: `Punto ${punto.nombre}`, style: 'subheader' });
            content.push({ text: punto.detalle, margin: [0, 0, 0, 5] });
            if (!resolucion?.voto_manual) {
                const resultados = await this.puntoUsuarioRepo.find({
                    where: { punto: { id_punto: punto.id_punto } },
                    relations: ['usuario', 'usuario.grupoUsuario'],
                });
                const resumen = {};
                for (const r of resultados) {
                    const grupo = r.usuario.grupoUsuario.nombre;
                    const peso = r.usuario.grupoUsuario.peso;
                    if (!resumen[grupo]) {
                        resumen[grupo] = {
                            grupo,
                            afavor: 0,
                            afavor_peso: 0,
                            encontra: 0,
                            encontra_peso: 0,
                            abstencion: 0,
                            abstencion_peso: 0,
                        };
                    }
                    switch (r.opcion) {
                        case 'afavor':
                            resumen[grupo].afavor++;
                            resumen[grupo].afavor_peso += peso;
                            break;
                        case 'encontra':
                            resumen[grupo].encontra++;
                            resumen[grupo].encontra_peso += peso;
                            break;
                        case 'abstencion':
                            resumen[grupo].abstencion++;
                            resumen[grupo].abstencion_peso += peso;
                            break;
                    }
                }
                const filas = Object.values(resumen).map((r) => [
                    r.grupo,
                    r.afavor,
                    r.afavor_peso.toFixed(2),
                    r.encontra,
                    r.encontra_peso.toFixed(2),
                    r.abstencion,
                    r.abstencion_peso.toFixed(2),
                ]);
                let totalAfavorPeso = 0;
                let totalEncontraPeso = 0;
                let totalAbstencionPeso = 0;
                Object.values(resumen).forEach((r) => {
                    totalAfavorPeso += r.afavor_peso;
                    totalEncontraPeso += r.encontra_peso;
                    totalAbstencionPeso += r.abstencion_peso;
                });
                filas.push([
                    { text: 'Total', bold: true },
                    punto.n_afavor,
                    `${totalAfavorPeso.toFixed(2)} (${punto.p_afavor}%)`,
                    punto.n_encontra,
                    `${totalEncontraPeso.toFixed(2)} (${punto.p_encontra}%)`,
                    punto.n_abstencion,
                    `${totalAbstencionPeso.toFixed(2)} (${punto.p_abstencion}%)`,
                ]);
                content.push({
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*', '*', '*'],
                        body: [
                            [
                                'Grupo Usuario',
                                'A Favor',
                                'A Favor Peso',
                                'En Contra',
                                'En Contra Peso',
                                'Abstención',
                                'Abstención Peso',
                            ],
                            ...filas,
                        ],
                    },
                    margin: [0, 0, 0, 10],
                });
            }
            if (resolucion) {
                content.push({
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            ['Resultado', punto.resultado],
                            ['Resolución', resolucion.nombre],
                            ['Descripción', resolucion.descripcion],
                        ],
                    },
                    margin: [0, 0, 0, 20],
                });
                content.push({
                    text: `Tipo de resolución: ${resolucion.voto_manual ? 'Manual (registrada por Secretaría)' : 'Automática (calculada por el sistema)'}`,
                    italics: true,
                    margin: [0, 0, 0, 20],
                });
            }
        }
        const docDefinition = {
            content,
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                subheader: { fontSize: 15, bold: true, margin: [0, 10, 0, 5] },
            },
        };
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:]/g, '')
            .replace(/\..+/, '')
            .replace('T', '_');
        const nombreArchivo = `reporte_sesion_${sesion.codigo || sesion.id_sesion}_${timestamp}.pdf`;
        const rutaArchivo = path.join(process.cwd(), 'uploads', nombreArchivo);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const stream = fs.createWriteStream(rutaArchivo);
        pdfDoc.pipe(stream);
        pdfDoc.end();
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        const documento = this.documentoRepo.create({
            nombre: nombreArchivo,
            url: `${process.env.APP_BASE_URL}/subidas/${nombreArchivo}`,
            fecha_subida: new Date(),
            estado: true,
            status: true,
        });
        const documentoGuardado = await this.documentoRepo.save(documento);
        const sesionDocumento = this.sesionDocumentoRepo.create({
            sesion,
            documento: documentoGuardado,
            estado: true,
            status: true,
        });
        await this.sesionDocumentoRepo.save(sesionDocumento);
        const buffer = fs.readFileSync(rutaArchivo);
        return buffer;
    }
};
exports.SesionService = SesionService;
exports.SesionService = SesionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sesion_entity_1.Sesion)),
    __param(1, (0, typeorm_1.InjectRepository)(punto_entity_1.Punto)),
    __param(2, (0, typeorm_1.InjectRepository)(punto_usuario_entity_1.PuntoUsuario)),
    __param(3, (0, typeorm_1.InjectRepository)(documento_entity_1.Documento)),
    __param(4, (0, typeorm_1.InjectRepository)(sesion_documento_entity_1.SesionDocumento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SesionService);
//# sourceMappingURL=sesion.service.js.map