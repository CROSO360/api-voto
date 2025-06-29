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
exports.PuntoUsuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const punto_usuario_entity_1 = require("./punto-usuario.entity");
const commons_service_1 = require("../commons/commons.service");
const sesion_service_1 = require("../sesion/sesion.service");
const punto_entity_1 = require("../punto/punto.entity");
const miembro_entity_1 = require("../miembro/miembro.entity");
let PuntoUsuarioService = class PuntoUsuarioService extends commons_service_1.BaseService {
    constructor(puntoUsuarioRepo, puntoRepo, miembroRepo, sesionService, dataSource) {
        super();
        this.puntoUsuarioRepo = puntoUsuarioRepo;
        this.puntoRepo = puntoRepo;
        this.miembroRepo = miembroRepo;
        this.sesionService = sesionService;
        this.dataSource = dataSource;
    }
    getRepository() {
        return this.puntoUsuarioRepo;
    }
    async generarVotacionesPorSesion(idSesion) {
        const sesion = await this.sesionService.findOne({ id_sesion: idSesion });
        if (!sesion)
            throw new common_1.BadRequestException('La sesión no existe');
        const puntos = await this.puntoRepo.find({
            where: { sesion: { id_sesion: idSesion }, status: true },
        });
        if (!puntos.length) {
            throw new common_1.BadRequestException('No hay puntos disponibles para votar');
        }
        const miembros = await this.miembroRepo.find({
            where: { estado: true, status: true },
            relations: ['usuario', 'usuario.grupoUsuario'],
        });
        if (!miembros.length) {
            throw new common_1.BadRequestException('No hay miembros del OCS registrados');
        }
        const puntoUsuarios = [];
        for (const punto of puntos) {
            for (const miembro of miembros) {
                const usuario = miembro.usuario;
                const esTrabajador = usuario.grupoUsuario?.nombre?.toLowerCase() === 'trabajador';
                const estado = punto.es_administrativa && esTrabajador ? false : true;
                const existe = await this.puntoUsuarioRepo.findOne({
                    where: {
                        punto: { id_punto: punto.id_punto },
                        usuario: { id_usuario: usuario.id_usuario },
                    },
                });
                if (!existe) {
                    puntoUsuarios.push(this.puntoUsuarioRepo.create({
                        punto: { id_punto: punto.id_punto },
                        usuario: { id_usuario: usuario.id_usuario },
                        estado,
                    }));
                }
            }
        }
        await this.puntoUsuarioRepo.save(puntoUsuarios);
    }
    async eliminarVotacionesPorSesion(idSesion) {
        const sesion = await this.sesionService.findOne({ id_sesion: idSesion });
        if (!sesion)
            throw new common_1.BadRequestException('La sesión no existe');
        if (sesion.fase?.toLowerCase() !== 'pendiente') {
            throw new common_1.BadRequestException('Solo puede eliminarse si la fase es "pendiente"');
        }
        const puntos = await this.puntoRepo.find({
            where: { sesion: { id_sesion: idSesion }, status: true },
        });
        if (!puntos.length)
            return;
        const idsPuntos = puntos.map((p) => p.id_punto);
        await this.puntoUsuarioRepo
            .createQueryBuilder()
            .delete()
            .from(punto_usuario_entity_1.PuntoUsuario)
            .where('id_punto IN (:...idsPuntos)', { idsPuntos })
            .execute();
    }
    async validarVoto(codigo, idUsuario, punto, opcion, es_razonado, votante) {
        const sesion = await this.sesionService.findOneBy({ codigo }, []);
        if (sesion &&
            idUsuario &&
            punto &&
            (opcion === 'afavor' ||
                opcion === 'encontra' ||
                opcion === 'abstencion' ||
                opcion === null)) {
            const puntoUsuario = await this.findOneBy({
                punto: { id_punto: punto },
                usuario: { id_usuario: idUsuario },
            }, ['punto', 'usuario']);
            const puntoUsuarioData = {
                id_punto_usuario: puntoUsuario.id_punto_usuario,
                opcion,
                es_razonado,
                votante: { id_usuario: votante },
                fecha: new Date(),
            };
            await this.save(puntoUsuarioData);
            return puntoUsuario.id_punto_usuario;
        }
        throw new common_1.UnauthorizedException('Campos del voto incorrectos');
    }
    async cambiarPrincipalAlterno(idSesion, idUsuario) {
        const puntos = await this.dataSource
            .getRepository(punto_entity_1.Punto)
            .createQueryBuilder('punto')
            .leftJoinAndSelect('punto.puntoUsuarios', 'puntoUsuario')
            .leftJoinAndSelect('puntoUsuario.usuario', 'usuario')
            .leftJoinAndSelect('usuario.usuarioReemplazo', 'reemplazo')
            .where('punto.sesion = :idSesion', { idSesion })
            .getMany();
        const puntoUsuariosAActualizar = [];
        for (const punto of puntos) {
            for (const pu of punto.puntoUsuarios) {
                const esTitular = pu.usuario.id_usuario === idUsuario;
                const esReemplazo = pu.usuario.usuarioReemplazo?.id_usuario === idUsuario;
                if (esTitular || esReemplazo) {
                    pu.es_principal = !pu.es_principal;
                    puntoUsuariosAActualizar.push(pu);
                }
            }
        }
        if (puntoUsuariosAActualizar.length === 0) {
            throw new common_1.NotFoundException('No se encontraron registros para actualizar');
        }
        await this.dataSource
            .getRepository(punto_usuario_entity_1.PuntoUsuario)
            .save(puntoUsuariosAActualizar);
    }
};
exports.PuntoUsuarioService = PuntoUsuarioService;
exports.PuntoUsuarioService = PuntoUsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(punto_usuario_entity_1.PuntoUsuario)),
    __param(1, (0, typeorm_1.InjectRepository)(punto_entity_1.Punto)),
    __param(2, (0, typeorm_1.InjectRepository)(miembro_entity_1.Miembro)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sesion_service_1.SesionService,
        typeorm_2.DataSource])
], PuntoUsuarioService);
//# sourceMappingURL=punto-usuario.service.js.map