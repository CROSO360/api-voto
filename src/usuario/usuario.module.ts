// ==============================
// Importaciones
// ==============================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

// ==============================
// Módulo UsuarioModule
// ==============================

@Module({
  imports: [
    // Importa la entidad Usuario para uso en el repositorio de TypeORM
    TypeOrmModule.forFeature([Usuario]),
  ],
  providers: [
    // Servicio que contiene la lógica de negocio del módulo
    UsuarioService,
  ],
  controllers: [
    // Controlador que maneja las rutas HTTP relacionadas a usuarios
    UsuarioController,
  ],
  exports: [
    // Permite que el servicio se utilice en otros módulos (ej: AuthModule)
    UsuarioService,
  ],
})
export class UsuarioModule {}
