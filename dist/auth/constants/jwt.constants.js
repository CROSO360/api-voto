"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
require('dotenv').config();
if (!process.env.JWT_SECRET) {
    throw new Error('Falta definir JWT_SECRET en el archivo .env');
}
exports.jwtConstants = {
    secret: process.env.JWT_SECRET,
};
//# sourceMappingURL=jwt.constants.js.map