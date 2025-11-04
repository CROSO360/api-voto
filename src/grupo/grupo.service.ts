import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { Grupo } from './grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PuntoGrupo } from 'src/punto-grupo/punto-grupo.entity';
import { Punto } from 'src/punto/punto.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { CreateGrupoDto } from 'src/auth/dto/create-grupo.dto';
import { CalcularResultadosGrupoDto, GrupoResultadoFuente } from 'src/auth/dto/calcular-resultados-grupo.dto';
import { ResultadoManualDto } from 'src/auth/dto/resultado-manual.dto';
import { VotoDto } from 'src/auth/dto/voto.dto';
import { PuntoService } from 'src/punto/punto.service';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Usuario } from 'src/usuario/usuario.entity';

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
    private readonly dataSource: DataSource,
    private readonly puntoService: PuntoService,
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
      throw new BadRequestException('Uno o mas puntos no existen');
    }

    const puntosResueltos = puntos.filter((punto) => punto.resultado !== null && punto.resultado !== undefined);
    if (puntosResueltos.length > 0) {
      throw new BadRequestException('No se pueden agrupar puntos que ya fueron resueltos');
      
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

  async calcularResultadosGrupo(dto: CalcularResultadosGrupoDto): Promise<Grupo> {
    const grupo = await this.grupoRepo.findOne({
      where: { id_grupo: dto.idGrupo },
      relations: ['puntoGrupos', 'puntoGrupos.punto'],
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    if (grupo.status === false) {
      throw new BadRequestException('El grupo ya fue resuelto.');
    }

    const puntosActivos = (grupo.puntoGrupos ?? []).filter(
      (puntoGrupo) =>
        puntoGrupo.estado !== false &&
        puntoGrupo.status !== false &&
        puntoGrupo.punto?.id_punto,
    );

    if (puntosActivos.length === 0) {
      throw new BadRequestException('El grupo no tiene puntos activos para calcular.');
    }

    const puntoResuelto = puntosActivos.find(
      (puntoGrupo) =>
        puntoGrupo.punto?.resultado !== null && puntoGrupo.punto?.resultado !== undefined,
    );

    if (puntoResuelto) {
      throw new BadRequestException(
        `El punto ${puntoResuelto.punto?.id_punto} ya tiene un resultado registrado.`,
      );
    }

    const modoCalculo = dto.modoCalculo ?? GrupoResultadoFuente.AUTOMATICO;
    const puntosPendientes = puntosActivos.filter(
      (puntoGrupo) =>
        puntoGrupo.punto?.resultado === null ||
        puntoGrupo.punto?.resultado === undefined,
    );
    const idsPuntos = puntosPendientes.map((pg) => pg.punto!.id_punto);
    const opcionesBase = { ...(dto.opciones ?? {}) };

    const manualPorPunto = new Map<number, ResultadoManualDto>();
    const votosPorPunto = new Map<number, VotoDto[]>();

    switch (modoCalculo) {
      case GrupoResultadoFuente.AUTOMATICO: {
        if (typeof dto.idUsuario !== 'number' || Number.isNaN(dto.idUsuario)) {
          throw new BadRequestException(
            'El idUsuario es obligatorio para el calculo automatico del grupo.',
          );
        }
        break;
      }
      case GrupoResultadoFuente.MANUAL: {
        const resultados = dto.resultadosManuales ?? [];
        if (resultados.length > 0) {
          for (const resultado of resultados) {
            const idPunto = resultado.id_punto;
            if (!idsPuntos.includes(idPunto)) {
              throw new BadRequestException(
                `El punto ${idPunto} no pertenece al grupo especificado.`,
              );
            }
            if (manualPorPunto.has(idPunto)) {
              throw new BadRequestException(
                `El punto ${idPunto} tiene mas de un resultado manual proporcionado.`,
              );
            }
            manualPorPunto.set(idPunto, resultado);
          }

          const faltantes = idsPuntos.filter((id) => !manualPorPunto.has(id));
          if (faltantes.length > 0) {
            throw new BadRequestException(
              `Faltan resultados manuales para los puntos: ${faltantes.join(', ')}.`,
            );
          }
        } else {
          if (typeof dto.idUsuario !== 'number' || Number.isNaN(dto.idUsuario)) {
            throw new BadRequestException(
              'El idUsuario es obligatorio cuando no se proporcionan resultados manuales por punto.',
            );
          }

          const override = opcionesBase.overrideResultado;
          if (
            override !== 'aprobada' &&
            override !== 'rechazada' &&
            override !== 'pendiente' &&
            override !== 'empate'
          ) {
            throw new BadRequestException(
              'Debe indicar la opcion de resultado manual del grupo en opciones.overrideResultado.',
            );
          }

          for (const idPunto of idsPuntos) {
            manualPorPunto.set(idPunto, {
              id_punto: idPunto,
              id_usuario: dto.idUsuario!,
              resultado: override,
              fuente_resultado: 'manual',
            });
          }
        }
        break;
      }
      case GrupoResultadoFuente.HIBRIDO: {
        const votos = dto.votos ?? [];
        if (votos.length === 0) {
          throw new BadRequestException(
            'Debe proporcionar votos para el calculo hibrido.',
          );
        }

        for (const voto of votos) {
          const idPunto = Number(voto.punto);
          if (!idsPuntos.includes(idPunto)) {
            throw new BadRequestException(
              `El voto recibido apunta al punto ${idPunto}, que no pertenece al grupo.`,
            );
          }
          if (!votosPorPunto.has(idPunto)) {
            votosPorPunto.set(idPunto, []);
          }
          votosPorPunto.get(idPunto)!.push(voto);
        }

        const faltantes = idsPuntos.filter((id) => !(votosPorPunto.get(id)?.length));
        if (faltantes.length > 0) {
          throw new BadRequestException(
            `Faltan votos para los puntos: ${faltantes.join(', ')}.`,
          );
        }
        break;
      }
      default:
        throw new BadRequestException(`Modo de calculo "${modoCalculo}" no soportado.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const puntoGrupo of puntosPendientes) {
        const idPunto = puntoGrupo.punto!.id_punto;

        switch (modoCalculo) {
          case GrupoResultadoFuente.AUTOMATICO: {
            await this.puntoService._calcularResultadosInterno(
              idPunto,
              dto.idUsuario!,
              queryRunner.manager,
              {
                ...opcionesBase,
                fuenteResultado: 'automatico',
              },
            );
            break;
          }
          case GrupoResultadoFuente.MANUAL: {
            const resultado = manualPorPunto.get(idPunto)!;
            const fuentesPermitidas: Array<'automatico' | 'manual' | 'hibrido'> = [
              'automatico',
              'manual',
              'hibrido',
            ];
            const fuente = fuentesPermitidas.includes(resultado.fuente_resultado as any)
              ? (resultado.fuente_resultado as 'automatico' | 'manual' | 'hibrido')
              : 'manual';

            await this.puntoService._calcularResultadosInterno(
              idPunto,
              resultado.id_usuario,
              queryRunner.manager,
              {
                ...opcionesBase,
                fuenteResultado: fuente,
                overrideResultado: resultado.resultado,
              },
            );
            break;
          }
          case GrupoResultadoFuente.HIBRIDO: {
            const votos = votosPorPunto.get(idPunto)!;
            const punto = await queryRunner.manager.findOne(Punto, {
              where: { id_punto: idPunto },
              relations: [
                'puntoUsuarios',
                'puntoUsuarios.usuario',
                'puntoUsuarios.usuario.grupoUsuario',
              ],
            });

            if (!punto) {
              throw new NotFoundException(`Punto con id ${idPunto} no encontrado.`);
            }

            if (punto.resultado !== null && punto.resultado !== undefined) {
              throw new BadRequestException(
                `El punto ${idPunto} ya tiene un resultado registrado.`,
              );
            }

            for (const voto of votos) {
              if (Number(voto.punto) !== idPunto) {
                throw new BadRequestException(
                  `Voto con punto invalido. Esperado: ${idPunto}, recibido: ${voto.punto}.`,
                );
              }

              const puntoUsuario = await queryRunner.manager.findOne(PuntoUsuario, {
                where: {
                  punto: { id_punto: idPunto },
                  usuario: { id_usuario: voto.idUsuario },
                },
                relations: ['usuario', 'punto', 'usuario.grupoUsuario'],
              });

              if (!puntoUsuario) {
                throw new NotFoundException(
                  `No se encontro puntoUsuario para el usuario ${voto.idUsuario} en el punto ${idPunto}.`,
                );
              }

              const votante = await queryRunner.manager.findOne(Usuario, {
                where: { id_usuario: voto.votante },
              });

              if (!votante) {
                throw new NotFoundException(
                  `Votante no encontrado para el id ${voto.votante}.`,
                );
              }

              puntoUsuario.opcion = voto.opcion;
              puntoUsuario.es_razonado = voto.es_razonado;
              puntoUsuario.votante = votante;
              puntoUsuario.fecha = new Date();

              await queryRunner.manager.save(PuntoUsuario, puntoUsuario);
            }

            const idUsuarioCalculo = votos[0]?.idUsuario;
            if (typeof idUsuarioCalculo !== 'number' || Number.isNaN(idUsuarioCalculo)) {
              throw new BadRequestException(
                `Los votos para el punto ${idPunto} no incluyen un idUsuario valido.`,
              );
            }

            await this.puntoService._calcularResultadosInterno(
              idPunto,
              idUsuarioCalculo,
              queryRunner.manager,
              {
                ...opcionesBase,
                fuenteResultado: 'hibrido',
              },
            );
            break;
          }
        }
      }

      await queryRunner.manager.update(
        Grupo,
        { id_grupo: grupo.id_grupo },
        { estado: false, status: false },
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return this.grupoRepo.findOne({
      where: { id_grupo: grupo.id_grupo },
      relations: ['puntoGrupos', 'puntoGrupos.punto'],
    });
  }

  async eliminarGrupo(idGrupo: number): Promise<void> {
    const grupo = await this.grupoRepo.findOne({
      where: { id_grupo: idGrupo },
      relations: ['sesion'],
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    if (grupo.status === false) {
      throw new BadRequestException('No se puede eliminar un grupo que ya fue resuelto.');
    }

    if (grupo.sesion?.fase === 'finalizada') {
      throw new BadRequestException('No se puede eliminar un grupo de una sesión finalizada.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PuntoGrupo)
        .where('id_grupo = :idGrupo', { idGrupo })
        .execute();

      await queryRunner.manager.delete(Grupo, { id_grupo: idGrupo });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
