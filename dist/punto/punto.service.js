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
exports.PuntoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const punto_entity_1 = require("./punto.entity");
const sesion_entity_1 = require("../sesion/sesion.entity");
const resolucion_entity_1 = require("../resolucion/resolucion.entity");
const punto_usuario_entity_1 = require("../punto-usuario/punto-usuario.entity");
let PuntoService = class PuntoService {
    constructor(puntoRepo, sesionRepo, resolucionRepo, puntoUsuarioRepo, dataSource) {
        this.puntoRepo = puntoRepo;
        this.sesionRepo = sesionRepo;
        this.resolucionRepo = resolucionRepo;
        this.puntoUsuarioRepo = puntoUsuarioRepo;
        this.dataSource = dataSource;
    }
    getRepository() {
        return this.puntoRepo;
    }
    async findAll(relations = []) {
        const options = {};
        if (relations.length > 0)
            options.relations = relations;
        return this.puntoRepo.find(options);
    }
    findOne(id) {
        return this.puntoRepo.findOne({ where: id });
    }
    async findOneBy(query, relations) {
        return this.puntoRepo.findOne({ where: query, relations });
    }
    async findAllBy(query, relations) {
        return this.puntoRepo.find({ where: query, relations });
    }
    save(entity) {
        return this.puntoRepo.save(entity);
    }
    saveMany(entities) {
        return this.puntoRepo.save(entities);
    }
    count(options) {
        return this.puntoRepo.count(options);
    }
    async crearPunto(createPuntoDto) {
        const { idSesion, nombre, detalle, es_administrativa } = createPuntoDto;
        const sesion = await this.sesionRepo.findOne({
            where: { id_sesion: idSesion },
        });
        if (!sesion)
            throw new common_1.BadRequestException(`La sesión con ID ${idSesion} no existe.`);
        const maxOrden = await this.puntoRepo
            .createQueryBuilder('punto')
            .select('COALESCE(MAX(punto.orden), 0)', 'max')
            .where('punto.id_sesion = :idSesion', { idSesion })
            .getRawOne();
        const nuevoOrden = Number(maxOrden.max) + 1;
        const nuevoPunto = this.puntoRepo.create({
            sesion,
            nombre,
            detalle: detalle || '',
            orden: nuevoOrden,
            es_administrativa: es_administrativa || false,
        });
        return await this.puntoRepo.save(nuevoPunto);
    }
    async eliminarPunto(idPunto) {
        const punto = await this.puntoRepo.findOne({
            where: { id_punto: idPunto },
            relations: ['sesion'],
        });
        if (!punto)
            throw new common_1.BadRequestException('El punto no existe.');
        if (punto.status !== true)
            throw new common_1.BadRequestException('No se puede eliminar un punto que ya ha sido tratado.');
        const idSesion = punto.sesion.id_sesion;
        await this.puntoRepo.delete(idPunto);
        await this.puntoRepo
            .createQueryBuilder()
            .update(punto_entity_1.Punto)
            .set({ orden: () => 'orden - 1' })
            .where('id_sesion = :idSesion AND orden > :orden', {
            idSesion,
            orden: punto.orden,
        })
            .execute();
    }
    async reordenarPunto(idPunto, posicionInicial, posicionFinal) {
        const punto = await this.puntoRepo.findOne({
            where: { id_punto: idPunto },
            relations: ['sesion'],
        });
        if (!punto)
            throw new common_1.BadRequestException('El punto no existe.');
        const idSesion = punto.sesion.id_sesion;
        await this.puntoRepo.manager.transaction(async (manager) => {
            let puntos = await manager.find(punto_entity_1.Punto, {
                where: {
                    sesion: { id_sesion: idSesion },
                    status: true,
                    orden: posicionInicial < posicionFinal
                        ? (0, typeorm_2.Between)(posicionInicial, posicionFinal)
                        : (0, typeorm_2.Between)(posicionFinal, posicionInicial),
                },
                order: { orden: posicionInicial < posicionFinal ? 'ASC' : 'DESC' },
            });
            const puntoMovido = puntos.find((p) => p.id_punto === idPunto);
            if (!puntoMovido)
                throw new common_1.BadRequestException('El punto a mover no se encuentra en el rango afectado.');
            puntoMovido.orden = 999;
            await manager.save(puntoMovido);
            for (const actual of puntos) {
                if (actual.id_punto === idPunto)
                    continue;
                const nuevoOrden = posicionInicial < posicionFinal ? actual.orden - 1 : actual.orden + 1;
                if (nuevoOrden < 1)
                    throw new common_1.BadRequestException(`No se puede asignar un orden menor que 1.`);
                const ocupante = puntos.find((p) => p.orden === nuevoOrden && p.id_punto !== idPunto);
                if (!ocupante) {
                    actual.orden = nuevoOrden;
                    await manager.save(actual);
                }
            }
            puntoMovido.orden = posicionFinal;
            await manager.save(puntoMovido);
            const puntosFinales = await manager.find(punto_entity_1.Punto, {
                where: { sesion: { id_sesion: idSesion }, status: true },
                order: { orden: 'ASC' },
            });
            for (let i = 0; i < puntosFinales.length; i++) {
                puntosFinales[i].orden = i + 1;
                await manager.save(puntosFinales[i]);
            }
        });
    }
    async calcularResultados(id_punto) {
        const punto = await this.puntoRepo.findOne({
            where: { id_punto },
            relations: [
                'resolucion',
                'puntoUsuarios',
                'puntoUsuarios.usuario',
                'puntoUsuarios.usuario.grupoUsuario',
            ],
        });
        if (!punto)
            throw new common_1.NotFoundException('Punto no encontrado');
        let puntoUsuarios = punto.puntoUsuarios.filter((pu) => pu.estado);
        if (punto.es_administrativa) {
            puntoUsuarios = puntoUsuarios.filter((pu) => pu.usuario.grupoUsuario.nombre.toLowerCase() !== 'trabajador');
        }
        let n_afavor = 0, n_encontra = 0, n_abstencion = 0;
        let p_afavor = 0, p_encontra = 0, p_abstencion = 0;
        let totalPeso = 0;
        for (const pu of puntoUsuarios) {
            const peso = pu.usuario.grupoUsuario.peso || 0;
            if (!pu.opcion || peso === 0)
                continue;
            totalPeso += peso;
            switch (pu.opcion) {
                case 'afavor':
                    n_afavor++;
                    p_afavor += peso;
                    break;
                case 'encontra':
                    n_encontra++;
                    p_encontra += peso;
                    break;
                case 'abstencion':
                    n_abstencion++;
                    p_abstencion += peso;
                    break;
            }
        }
        const normalizar = (valor) => totalPeso > 0 ? parseFloat(((valor / totalPeso) * 100).toFixed(2)) : 0;
        punto.n_afavor = n_afavor;
        punto.n_encontra = n_encontra;
        punto.n_abstencion = n_abstencion;
        punto.p_afavor = normalizar(p_afavor);
        punto.p_encontra = normalizar(p_encontra);
        punto.p_abstencion = normalizar(p_abstencion);
        if (punto.resolucion) {
            punto.resolucion.voto_manual = false;
            await this.resolucionRepo.save(punto.resolucion);
        }
        if (punto.p_afavor > punto.p_encontra &&
            punto.p_afavor > punto.p_abstencion) {
            punto.resultado = 'aprobada';
        }
        else if (punto.p_encontra > punto.p_afavor &&
            punto.p_encontra > punto.p_abstencion) {
            punto.resultado = 'rechazada';
        }
        else {
            punto.resultado = 'pendiente';
        }
        await this.resolucionRepo.save(punto.resolucion);
        await this.puntoRepo.save(punto);
    }
    async calcularResultadosManual(dto) {
        const { id_punto, id_usuario, resultado } = dto;
        const punto = await this.puntoRepo.findOne({
            where: { id_punto },
            relations: ['resolucion'],
        });
        if (!punto)
            throw new common_1.NotFoundException('Punto no encontrado');
        if (!punto.resolucion)
            throw new common_1.BadRequestException('No se puede registrar el resultado manual sin una resolución');
        punto.resultado = resultado;
        punto.resolucion.voto_manual = true;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET @usuario_actual = ?`, [id_usuario]);
            await queryRunner.manager.save(punto.resolucion);
            await queryRunner.manager.save(punto);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error al guardar la resolución manual:', error);
            throw new common_1.BadRequestException('No se pudo guardar el resultado manual.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getResultadosPunto(idPunto) {
        const query = `
      SELECT
        gu.nombre AS grupo_usuario,
        COALESCE(SUM(CASE WHEN pu.opcion = 'afavor' THEN 1 ELSE 0 END), 0) AS afavor,
        ROUND(COALESCE(SUM(CASE WHEN pu.opcion = 'afavor' THEN gu.peso ELSE 0 END), 2), 2) AS afavor_peso,
        COALESCE(SUM(CASE WHEN pu.opcion = 'encontra' THEN 1 ELSE 0 END), 0) AS encontra,
        ROUND(COALESCE(SUM(CASE WHEN pu.opcion = 'encontra' THEN gu.peso ELSE 0 END), 2), 2) AS encontra_peso,
        COALESCE(SUM(CASE WHEN pu.opcion = 'abstencion' THEN 1 ELSE 0 END), 0) AS abstencion,
        ROUND(COALESCE(SUM(CASE WHEN pu.opcion = 'abstencion' THEN gu.peso ELSE 0 END), 2), 2) AS abstencion_peso
      FROM grupo_usuario gu
      LEFT JOIN usuario u ON gu.id_grupo_usuario = u.id_grupo_usuario
      LEFT JOIN punto_usuario pu ON u.id_usuario = pu.id_usuario AND pu.id_punto = ?
      GROUP BY gu.nombre
      ORDER BY
        CASE
          WHEN gu.nombre = 'rector' THEN 1
          WHEN gu.nombre = 'vicerrector' THEN 2
          WHEN gu.nombre = 'decano' THEN 3
          WHEN gu.nombre = 'profesor' THEN 4
          WHEN gu.nombre = 'estudiante' THEN 5
          WHEN gu.nombre = 'trabajador' THEN 6
          ELSE 7
        END;
    `;
        const resultados = await this.puntoRepo.query(query, [idPunto]);
        const totales = resultados.reduce((acc, item) => {
            acc.afavor += parseInt(item.afavor);
            acc.afavor_peso += parseFloat(item.afavor_peso);
            acc.encontra += parseInt(item.encontra);
            acc.encontra_peso += parseFloat(item.encontra_peso);
            acc.abstencion += parseInt(item.abstencion);
            acc.abstencion_peso += parseFloat(item.abstencion_peso);
            return acc;
        }, {
            afavor: 0,
            afavor_peso: 0,
            encontra: 0,
            encontra_peso: 0,
            abstencion: 0,
            abstencion_peso: 0,
        });
        totales.afavor_peso = +totales.afavor_peso.toFixed(2);
        totales.encontra_peso = +totales.encontra_peso.toFixed(2);
        totales.abstencion_peso = +totales.abstencion_peso.toFixed(2);
        return [...resultados, { resultado: totales }];
    }
};
exports.PuntoService = PuntoService;
exports.PuntoService = PuntoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(punto_entity_1.Punto)),
    __param(1, (0, typeorm_1.InjectRepository)(sesion_entity_1.Sesion)),
    __param(2, (0, typeorm_1.InjectRepository)(resolucion_entity_1.Resolucion)),
    __param(3, (0, typeorm_1.InjectRepository)(punto_usuario_entity_1.PuntoUsuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PuntoService);
//# sourceMappingURL=punto.service.js.map