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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const usuario_service_1 = require("../usuario/usuario.service");
const punto_usuario_service_1 = require("../punto-usuario/punto-usuario.service");
const sesion_service_1 = require("../sesion/sesion.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usuarioService, jwtService, sesionService, puntoUsuarioService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.sesionService = sesionService;
        this.puntoUsuarioService = puntoUsuarioService;
    }
    async validateUser(codigo, pass) {
        const query = { codigo };
        const relations = ['usuarioReemplazo', 'grupoUsuario'];
        const user = await this.usuarioService.findOneBy(query, relations);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        if (!user.contrasena) {
            throw new common_1.UnauthorizedException('El usuario no tiene contraseña almacenada');
        }
        const isPasswordValid = await bcrypt.compare(pass, user.contrasena);
        if (isPasswordValid && user.tipo === 'administrador') {
            const { contrasena, puntoUsuarios, codigo, usuarioReemplazo, grupoUsuario, ...result } = user;
            const payload = { codigo: user.codigo, nombre: user.nombre };
            const token = await this.jwtService.signAsync(payload);
            return {
                token,
                result,
            };
        }
        throw new common_1.UnauthorizedException('Credenciales de administrador incorrectas');
    }
    async validateVoter(codigo, cedula) {
        const query = { codigo };
        const relations = ['usuarioReemplazo', 'grupoUsuario'];
        const user = await this.usuarioService.findOneBy(query, relations);
        if (user && user.tipo === 'votante') {
            if (user.cedula === cedula) {
                const { contrasena, puntoUsuarios, codigo, usuarioReemplazo, grupoUsuario, ...result } = user;
                const payload = {
                    id: user.id_usuario,
                    codigo: user.codigo,
                    nombre: user.nombre,
                };
                const token = await this.jwtService.signAsync(payload);
                return {
                    token,
                    result,
                };
            }
        }
        throw new common_1.UnauthorizedException('Credenciales de votante incorrectas');
    }
    async validateVoterReemplazo(codigo, cedula) {
        const query = { codigo };
        const relations = ['grupoUsuario'];
        const user = await this.usuarioService.findOneBy(query, relations);
        if (user && user.tipo === 'votante' && user.cedula === cedula) {
            const usuarioPrincipal = await this.usuarioService.getUsuarioPrincipalPorReemplazo(user.id_usuario);
            if (!usuarioPrincipal) {
                throw new common_1.UnauthorizedException('El usuario no es un reemplazo de ningún otro usuario.');
            }
            const payload = {
                id: user.id_usuario,
                codigo: user.codigo,
                nombre: user.nombre,
                id_principal: usuarioPrincipal.id_usuario,
                nombre_principal: usuarioPrincipal.nombre,
            };
            const token = await this.jwtService.signAsync(payload);
            return {
                token,
                result: {
                    ...user,
                    principal: usuarioPrincipal,
                },
            };
        }
        throw new common_1.UnauthorizedException('Credenciales de votante incorrectas');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
        jwt_1.JwtService,
        sesion_service_1.SesionService,
        punto_usuario_service_1.PuntoUsuarioService])
], AuthService);
//# sourceMappingURL=auth.service.js.map