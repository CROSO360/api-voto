import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { Grupo } from './grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuntoGrupo } from 'src/punto-grupo/punto-grupo.entity';
import { Punto } from 'src/punto/punto.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { CreateGrupoDto } from 'src/auth/dto/create-grupo.dto';

@Injectable()
export class GrupoService extends BaseService<Grupo> {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(PuntoGrupo)
    private readonly puntoGrupoRepository: Repository<PuntoGrupo>,

    @InjectRepository(Punto)
    private readonly puntoRepository: Repository<Punto>,

    @InjectRepository(Sesion)
    private readonly sesionRepository: Repository<Sesion>,
  ) {
    super();
  }

  getRepository(): Repository<Grupo> {
    return this.grupoRepo;
  }

  async crearGrupoConPuntos(dto: CreateGrupoDto): Promise<Grupo> {
    const sesion = await this.sesionRepository.findOne({ where: { id_sesion: dto.idSesion } });
    if (!sesion) throw new NotFoundException('Sesión no encontrada');

    const grupo = this.grupoRepo.create({
      nombre: dto.nombre,
      sesion,
      estado: true,
      status: true,
    });

    const grupoGuardado = await this.grupoRepo.save(grupo);

    const puntos = await this.puntoRepository.findByIds(dto.puntos);
    if (puntos.length !== dto.puntos.length) {
      throw new BadRequestException('Uno o más puntos no existen');
    }

    const puntoGrupos = dto.puntos.map((idPunto) =>
      this.puntoGrupoRepository.create({
        grupo: grupoGuardado,
        punto: { id_punto: idPunto } as Punto, // Referencia directa
        estado: true,
        status: true,
      }),
    );

    await this.puntoGrupoRepository.save(puntoGrupos);

    return this.grupoRepo.findOne({
      where: { id_grupo: grupoGuardado.id_grupo },
      relations: ['puntoGrupos', 'puntoGrupos.punto'],
    });
  }
}
