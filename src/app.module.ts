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
import { ResolucionController } from './resolucion/resolucion.controller';
import { ResolucionService } from './resolucion/resolucion.service';
import { ResolucionModule } from './resolucion/resolucion.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { DocumentoModule } from './documento/documento.module';
import { SesionDocumentoModule } from './sesion-documento/sesion-documento.module';
import { MiembroModule } from './miembro/miembro.module';
import { FacultadModule } from './facultad/facultad.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { PuntoDocumentoModule } from './punto-documento/punto-documento.module';

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
        autoLoadEntities: true,
        //logging: true
      })
    }),
    SesionModule,
    PuntoModule,
    PuntoUsuarioModule,
    UsuarioModule,
    GrupoUsuarioModule,
    AuthModule,
    ResolucionModule,
    AsistenciaModule,
    DocumentoModule,
    SesionDocumentoModule,
    PuntoDocumentoModule,
    MiembroModule,
    FacultadModule,
    AuditoriaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
