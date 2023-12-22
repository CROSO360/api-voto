import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionModule } from './sesion/sesion.module';
import { PuntoModule } from './punto/punto.module';
import { PuntoUsuarioModule } from './punto-usuario/punto-usuario.module';
import { UsuarioModule } from './usuario/usuario.module';
import { GrupoUsuarioModule } from './grupo-usuario/grupo-usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        autoLoadEntities: true
      })
    }),
    SesionModule,
    PuntoModule,
    PuntoUsuarioModule,
    UsuarioModule,
    GrupoUsuarioModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
