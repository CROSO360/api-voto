import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,Accept,Content-Type,Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
