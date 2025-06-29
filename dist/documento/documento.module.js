"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const multer = require("multer");
const documento_service_1 = require("./documento.service");
const documento_controller_1 = require("./documento.controller");
const documento_entity_1 = require("./documento.entity");
let DocumentoModule = class DocumentoModule {
};
exports.DocumentoModule = DocumentoModule;
exports.DocumentoModule = DocumentoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([documento_entity_1.Documento]),
            platform_express_1.MulterModule.register({
                storage: multer.diskStorage({
                    destination: './uploads',
                    filename: (req, file, cb) => {
                        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
                        cb(null, uniqueName);
                    },
                }),
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/subidas',
            }),
        ],
        providers: [documento_service_1.DocumentoService],
        controllers: [documento_controller_1.DocumentoController],
        exports: [documento_service_1.DocumentoService],
    })
], DocumentoModule);
//# sourceMappingURL=documento.module.js.map