"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const usuario_module_1 = require("./usuario/usuario.module");
const grupo_usuario_module_1 = require("./grupo-usuario/grupo-usuario.module");
const miembro_module_1 = require("./miembro/miembro.module");
const facultad_module_1 = require("./facultad/facultad.module");
const sesion_module_1 = require("./sesion/sesion.module");
const punto_module_1 = require("./punto/punto.module");
const punto_usuario_module_1 = require("./punto-usuario/punto-usuario.module");
const resolucion_module_1 = require("./resolucion/resolucion.module");
const asistencia_module_1 = require("./asistencia/asistencia.module");
const documento_module_1 = require("./documento/documento.module");
const sesion_documento_module_1 = require("./sesion-documento/sesion-documento.module");
const punto_documento_module_1 = require("./punto-documento/punto-documento.module");
const auditoria_module_1 = require("./auditoria/auditoria.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'mysql',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    autoLoadEntities: true,
                }),
            }),
            sesion_module_1.SesionModule,
            punto_module_1.PuntoModule,
            punto_usuario_module_1.PuntoUsuarioModule,
            usuario_module_1.UsuarioModule,
            grupo_usuario_module_1.GrupoUsuarioModule,
            auth_module_1.AuthModule,
            resolucion_module_1.ResolucionModule,
            asistencia_module_1.AsistenciaModule,
            documento_module_1.DocumentoModule,
            sesion_documento_module_1.SesionDocumentoModule,
            punto_documento_module_1.PuntoDocumentoModule,
            miembro_module_1.MiembroModule,
            facultad_module_1.FacultadModule,
            auditoria_module_1.AuditoriaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map