import { Module } from '@nestjs/common';
import { PuntoGrupoService } from './punto-grupo.service';
import { PuntoGrupoController } from './punto-grupo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntoGrupo } from './punto-grupo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PuntoGrupo])],
  providers: [PuntoGrupoService],
  controllers: [PuntoGrupoController],
  exports: [PuntoGrupoService,
    TypeOrmModule.forFeature([PuntoGrupo])
  ],
})
export class PuntoGrupoModule {}
