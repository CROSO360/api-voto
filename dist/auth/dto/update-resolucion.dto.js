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
exports.UpdateResolucionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateResolucionDto {
}
exports.UpdateResolucionDto = UpdateResolucionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El id del punto es obligatorio' }),
    __metadata("design:type", Number)
], UpdateResolucionDto.prototype, "id_punto", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El id del usuario es obligatorio' }),
    __metadata("design:type", Number)
], UpdateResolucionDto.prototype, "id_usuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la resolución no puede estar vacío' }),
    __metadata("design:type", String)
], UpdateResolucionDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción de la resolución no puede estar vacía' }),
    __metadata("design:type", String)
], UpdateResolucionDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de la resolución es obligatoria' }),
    __metadata("design:type", Date)
], UpdateResolucionDto.prototype, "fecha", void 0);
//# sourceMappingURL=update-resolucion.dto.js.map