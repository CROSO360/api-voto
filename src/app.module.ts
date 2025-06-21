// =============================================================
// AppModule
// Módulo principal del sistema: configuración global y módulos
// =============================================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Seguridad y autenticación
import { AuthModule } from './auth/auth.module';

// Gestión de usuarios y grupos
import { UsuarioModule } from './usuario/usuario.module';
import { GrupoUsuarioModule } from './grupo-usuario/grupo-usuario.module';
import { MiembroModule } from './miembro/miembro.module';
import { FacultadModule } from './facultad/facultad.module';

// Gestión de sesiones, puntos y votación
import { SesionModule } from './sesion/sesion.module';
import { PuntoModule } from './punto/punto.module';
import { PuntoUsuarioModule } from './punto-usuario/punto-usuario.module';
import { ResolucionModule } from './resolucion/resolucion.module';
import { AsistenciaModule } from './asistencia/asistencia.module';

// Documentos y auditoría
import { DocumentoModule } from './documento/documento.module';
import { SesionDocumentoModule } from './sesion-documento/sesion-documento.module';
import { PuntoDocumentoModule } from './punto-documento/punto-documento.module';
import { AuditoriaModule } from './auditoria/auditoria.module';

@Module({
  imports: [
    // Variables de entorno (Config)
    ConfigModule.forRoot(),

    // Configuración de conexión a base de datos
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        // logging: true, // Habilitar para debug de queries
      }),
    }),

    // Módulos funcionales
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
    AuditoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
