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

    @InjectRepository(Miembro)
    private readonly miembroRepo: Repository<Miembro>,

    private readonly sesionService: SesionService,
    private dataSource: DataSource,
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
    idUsuario: number,
    punto: number,
    opcion: string | null,
    es_razonado: boolean,
    votante: number,
  ): Promise<number> {
    const sesion = await this.sesionService.findOneBy({ codigo }, []);

    if (
      sesion &&
      idUsuario &&
      punto &&
      (opcion === 'afavor' ||
        opcion === 'encontra' ||
        opcion === 'abstencion' ||
        opcion === null)
    ) {
      const puntoUsuario = await this.findOneBy(
        {
          punto: { id_punto: punto },
          usuario: { id_usuario: idUsuario },
        },
        ['punto', 'usuario'],
      );

      const puntoUsuarioData: any = {
        id_punto_usuario: puntoUsuario.id_punto_usuario,
        opcion,
        es_razonado,
        votante: { id_usuario: votante },
        fecha: new Date(),
      };

      await this.save(puntoUsuarioData);
      return puntoUsuario.id_punto_usuario;
    }

    throw new UnauthorizedException('Campos del voto incorrectos');
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
        const esTitular = pu.usuario.id_usuario === idUsuario;
        const esReemplazo =
          pu.usuario.usuarioReemplazo?.id_usuario === idUsuario;

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
