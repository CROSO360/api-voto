// =======================================================
// CONSTANTES JWT
// Carga del secreto desde variables de entorno
// =======================================================

require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('Falta definir JWT_SECRET en el archivo .env');
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
