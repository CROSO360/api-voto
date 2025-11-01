import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './grupo.entity';
import { Punto } from 'src/punto/punto.entity';
import { PuntoGrupo } from 'src/punto-grupo/punto-grupo.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { PuntoGrupoModule } from 'src/punto-grupo/punto-grupo.module';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { PuntoModule } from 'src/punto/punto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grupo, Punto, PuntoGrupo, Sesion, PuntoUsuario]),
    PuntoGrupoModule,
    PuntoModule,
  ],
  providers: [GrupoService],
  controllers: [GrupoController],
  exports: [GrupoService],
})
export class GrupoModule {}
