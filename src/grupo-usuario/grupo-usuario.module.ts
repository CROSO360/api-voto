// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GrupoUsuario } from './grupo-usuario.entity';
import { GrupoUsuarioService } from './grupo-usuario.service';
import { GrupoUsuarioController } from './grupo-usuario.controller';

// =======================================================
// MÓDULO: GrupoUsuarioModule
// =======================================================

@Module({
  imports: [TypeOrmModule.forFeature([GrupoUsuario])],
  providers: [GrupoUsuarioService],
  controllers: [GrupoUsuarioController],
  exports: [GrupoUsuarioService]
})
export class GrupoUsuarioModule {}
