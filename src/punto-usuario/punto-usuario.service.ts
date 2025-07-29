// =======================================================
// IMPORTACIONES
// =======================================================

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { PuntoUsuario } from './punto-usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { SesionService } from 'src/sesion/sesion.service';
import { Punto } from 'src/punto/punto.entity';
import { Miembro } from 'src/miembro/miembro.entity';
import { Grupo } from 'src/grupo/grupo.entity';
import {
  VotarGrupoDto,
  VotarGrupoRespuesta,
} from 'src/auth/dto/votar-grupo.dto';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { Usuario } from 'src/usuario/usuario.entity';

// =======================================================
// SERVICIO: PuntoUsuarioService
// =======================================================

@Injectable()
export class PuntoUsuarioService extends BaseService<PuntoUsuario> {
  constructor(
    @InjectRepository(PuntoUsuario)
    private puntoUsuarioRepo: Repository<PuntoUsuario>,

    @InjectRepository(Punto)
    private readonly puntoRepo: Repository<Punto>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Miembro)
    private readonly miembroRepo: Repository<Miembro>,

    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,

    private readonly sesionService: SesionService,
    private dataSource: DataSource,
    private readonly websocketGateway: WebsocketGateway,
  ) {
    super();
  }

  getRepository(): Repository<PuntoUsuario> {
    return this.puntoUsuarioRepo;
  }

  // ===================================================
  // GENERACIÓN Y ELIMINACIÓN MASIVA DE VOTACIONES
  // ===================================================

  async generarVotacionesPorSesion(idSesion: number): Promise<void> {
    const sesion = await this.sesionService.findOne({ id_sesion: idSesion });
    if (!sesion) throw new BadRequestException('La sesión no existe');

    const puntos = await this.puntoRepo.find({
      where: { sesion: { id_sesion: idSesion }, status: true },
    });

    if (!puntos.length) {
      throw new BadRequestException('No hay puntos disponibles para votar');
    }

    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario', 'usuario.grupoUsuario'],
    });

    if (!miembros.length) {
      throw new BadRequestException('No hay miembros del OCS registrados');
    }

    const puntoUsuarios: PuntoUsuario[] = [];

    for (const punto of puntos) {
      for (const miembro of miembros) {
        const usuario = miembro.usuario;
        const esTrabajador =
          usuario.grupoUsuario?.nombre?.toLowerCase() === 'trabajador';
        const estado = punto.es_administrativa && esTrabajador ? false : true;

        const existe = await this.puntoUsuarioRepo.findOne({
          where: {
            punto: { id_punto: punto.id_punto },
            usuario: { id_usuario: usuario.id_usuario },
          },
        });

        if (!existe) {
          puntoUsuarios.push(
            this.puntoUsuarioRepo.create({
              punto: { id_punto: punto.id_punto },
              usuario: { id_usuario: usuario.id_usuario },
              estado,
            }),
          );
        }
      }
    }

    await this.puntoUsuarioRepo.save(puntoUsuarios);
  }

  async eliminarVotacionesPorSesion(idSesion: number): Promise<void> {
    const sesion = await this.sesionService.findOne({ id_sesion: idSesion });
    if (!sesion) throw new BadRequestException('La sesión no existe');

    if (sesion.fase?.toLowerCase() !== 'pendiente') {
      throw new BadRequestException(
        'Solo puede eliminarse si la fase es "pendiente"',
      );
    }

    const puntos = await this.puntoRepo.find({
      where: { sesion: { id_sesion: idSesion }, status: true },
    });

    if (!puntos.length) return;

    const idsPuntos = puntos.map((p) => p.id_punto);

    await this.puntoUsuarioRepo
      .createQueryBuilder()
      .delete()
      .from(PuntoUsuario)
      .where('id_punto IN (:...idsPuntos)', { idsPuntos })
      .execute();
  }

  // ===================================================
  // REGISTRO DE VOTO
  // ===================================================

  async validarVoto(
    codigo: string,
    id_usuario: number,
    punto: number,
    opcion: string | null,
    es_razonado: boolean,
    votante: number,
  ): Promise<number> {
    try {
      console.log('DTO recibido:', {
        codigo,
        id_usuario,
        punto,
        opcion,
        es_razonado,
        votante,
      });

      const sesion = await this.sesionService.findOneBy({ codigo }, []);
      //console.log('Sesión encontrada:', sesion);

      if (
        sesion &&
        id_usuario &&
        punto &&
        (opcion === 'afavor' ||
          opcion === 'encontra' ||
          opcion === 'abstencion' ||
          opcion === null)
      ) {
        const puntoUsuario = await this.findOneBy(
          {
            punto: { id_punto: punto },
            usuario: { id_usuario },
          },
          ['punto', 'usuario'],
        );

        //console.log('PuntoUsuario encontrado:', puntoUsuario);

        if (!puntoUsuario) {
          throw new NotFoundException(
            'Voto no disponible para este usuario y punto',
          );
        }

        const votanteEntity = await this.usuarioRepo.findOne({
          where: { id_usuario: votante },
        });

        if (!votanteEntity)
          throw new NotFoundException('Votante no encontrado');

        const puntoUsuarioData: any = {
          id_punto_usuario: puntoUsuario.id_punto_usuario,
          opcion,
          es_razonado,
          votante: votanteEntity,
          fecha: new Date(),
        };

        await this.save(puntoUsuarioData);
        return puntoUsuario.id_punto_usuario;
      }

      throw new UnauthorizedException('Campos del voto incorrectos');
    } catch (err) {
      console.error('❌ Error en validarVoto:', err);
      throw err;
    }
  }

  async votarGrupo(
    idGrupo: number,
    dto: VotarGrupoDto,
  ): Promise<VotarGrupoRespuesta> {
    const grupo = await this.grupoRepository.findOne({
      where: { id_grupo: idGrupo },
      relations: ['puntoGrupos', 'puntoGrupos.punto'],
    });

    if (!grupo) throw new NotFoundException('Grupo no encontrado');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resultados: number[] = [];

      for (const pg of grupo.puntoGrupos) {
        const puntoUsuario = await this.findOneBy(
          {
            punto: { id_punto: pg.punto.id_punto },
            usuario: { id_usuario: dto.idUsuario },
          },
          ['punto', 'usuario'],
        );

        if (!puntoUsuario) {
          throw new NotFoundException(
            `Voto no disponible para punto ${pg.punto.id_punto}`,
          );
        }

        const puntoUsuarioData: any = {
          id_punto_usuario: puntoUsuario.id_punto_usuario,
          opcion: dto.opcion,
          es_razonado: dto.es_razonado,
          votante: { id_usuario: dto.votante },
          fecha: new Date(),
        };

        await queryRunner.manager.save(PuntoUsuario, puntoUsuarioData);
        resultados.push(puntoUsuario.id_punto_usuario);
      }

      await queryRunner.commitTransaction();

      // Emitimos los cambios uno por uno
      for (const id of resultados) {
        this.websocketGateway.emitChange(id);
      }

      return {
        mensaje: `Voto emitido en los puntos del grupo ${idGrupo}`,
        ids: resultados,
      };
    } catch (error) {
      console.error('Error al votar grupo:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error al votar grupo: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  // ===================================================
  // CAMBIO PRINCIPAL ↔ REEMPLAZO
  // ===================================================

  async cambiarPrincipalAlterno(
    idSesion: number,
    idUsuario: number,
  ): Promise<void> {
    const puntos = await this.dataSource
      .getRepository(Punto)
      .createQueryBuilder('punto')
      .leftJoinAndSelect('punto.puntoUsuarios', 'puntoUsuario')
      .leftJoinAndSelect('puntoUsuario.usuario', 'usuario')
      .leftJoinAndSelect('usuario.usuarioReemplazo', 'reemplazo')
      .where('punto.sesion = :idSesion', { idSesion })
      .getMany();

    const puntoUsuariosAActualizar: PuntoUsuario[] = [];

    for (const punto of puntos) {
      for (const pu of punto.puntoUsuarios) {
        const usuario = pu.usuario;
        const esTitular = usuario.id_usuario === idUsuario;
        const esReemplazo = usuario.usuarioReemplazo?.id_usuario === idUsuario;

        // Validar que el titular tenga reemplazo antes de cambiar
        if (esTitular && !usuario.usuarioReemplazo) {
          throw new BadRequestException(
            `El usuario ${usuario.nombre} no tiene un reemplazo asignado.`,
          );
        }

        if (esTitular || esReemplazo) {
          pu.es_principal = !pu.es_principal;
          puntoUsuariosAActualizar.push(pu);
        }
      }
    }

    if (puntoUsuariosAActualizar.length === 0) {
      throw new NotFoundException(
        'No se encontraron registros para actualizar',
      );
    }

    await this.dataSource
      .getRepository(PuntoUsuario)
      .save(puntoUsuariosAActualizar);
  }
}
