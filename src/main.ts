// ==========================================
// main.ts - Punto de entrada de la aplicación
// ==========================================

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config(); // Cargar variables de entorno

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Configuración de CORS para clientes web y móvil
  const corsOptions = {
    origin: [process.env.VOTACION_OCS_URL, process.env.VOTO_MOVIL_OCS_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,Accept,Content-Type,Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // Aquí se expone manualmente el servidor HTTP
  const httpServer = createServer(app.getHttpAdapter().getInstance());

  // Iniciar servidor
  const PORT = process.env.PORT || 3000;
  await app.init();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  });
}
bootstrap();
