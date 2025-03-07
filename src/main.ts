import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: import("@nestjs/common/interfaces/external/cors-options.interface").CorsOptions = {
    origin: ['https://testing-c0624.web.app','http://localhost:4200','https://test-movile.web.app','http://localhost:53066'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,Accept,Content-Type,Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
