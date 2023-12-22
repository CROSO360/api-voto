import { Module } from '@nestjs/common';
import { GrupoUsuarioService } from './grupo-usuario.service';
import { GrupoUsuarioController } from './grupo-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoUsuario } from './grupo-usuario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GrupoUsuario])],
  providers: [GrupoUsuarioService],
  controllers: [GrupoUsuarioController]
})
export class GrupoUsuarioModule {}
