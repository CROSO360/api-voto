import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SesionService } from 'src/sesion/sesion.service';
import { Punto } from 'src/punto/punto.entity';
import { Miembro } from 'src/miembro/miembro.entity';

@Injectable()
export class PuntoUsuarioService extends BaseService<PuntoUsuario> {
  constructor(
    @InjectRepository(PuntoUsuario)
    private puntoUsuarioRepo: Repository<PuntoUsuario>,
    @InjectRepository(Punto) private readonly puntoRepo: Repository<Punto>,
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

  async generarVotacionesPorSesion(idSesion: number): Promise<void> {
    const sesion = await this.sesionService.findOne({ id_sesion: idSesion });
    if (!sesion) throw new BadRequestException('La sesión no existe');

    // Obtener todos los puntos activos de la sesión
    const puntos = await this.puntoRepo.find({
      where: { sesion: { id_sesion: idSesion }, status: true },
      relations: [],
    });

    if (!puntos.length) {
      throw new BadRequestException(
        'No hay puntos disponibles para generar votación',
      );
    }

    // Obtener miembros activos con usuario y grupoUsuario
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
          const puntoUsuario = this.puntoUsuarioRepo.create({
            punto: { id_punto: punto.id_punto },
            usuario: { id_usuario: usuario.id_usuario },
            estado,
          });

          puntoUsuarios.push(puntoUsuario);
        }
      }
    }

    await this.puntoUsuarioRepo.save(puntoUsuarios);
  }

  async eliminarVotacionesPorSesion(idSesion: number): Promise<void> {
    const sesion = await this.sesionService.findOne({ id_sesion: idSesion });

    if (!sesion) {
      throw new BadRequestException('La sesión no existe.');
    }

    if (sesion.fase?.toLowerCase() !== 'pendiente') {
      throw new BadRequestException(
        'Solo se pueden eliminar votaciones si la sesión está en fase "pendiente".',
      );
    }

    // Obtener los puntos activos de la sesión
    const puntos = await this.puntoRepo.find({
      where: { sesion: { id_sesion: idSesion }, status: true },
    });

    if (!puntos.length) return;

    const idsPuntos = puntos.map((p) => p.id_punto);

    // Eliminar todos los punto_usuario vinculados a estos puntos
    await this.puntoUsuarioRepo
      .createQueryBuilder()
      .delete()
      .from(PuntoUsuario)
      .where('id_punto IN (:...idsPuntos)', { idsPuntos })
      .execute();
  }

  async validarVoto(
  codigo: string,
  idUsuario: number,
  punto: number,
  opcion: string | null,
  es_razonado: boolean,
  votante: number
): Promise<number> {
  const sesion = await this.sesionService.findOneBy({ codigo }, []);

  if (
    sesion &&
    idUsuario &&
    punto &&
    (opcion === 'afavor' || opcion === 'encontra' || opcion === 'abstencion' || opcion === null)
  ) {
    const puntoUsuario = await this.findOneBy(
      {
        punto: { id_punto: punto },
        usuario: { id_usuario: idUsuario }
      },
      ['punto', 'usuario']
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


  async cambiarPrincipalAlterno(idSesion: number, idUsuario: number): Promise<void> {
  //console.log(`🔄 Iniciando cambio de principal/alterno para usuario ${idUsuario} en sesión ${idSesion}`);

  const puntos = await this.dataSource.getRepository(Punto)
    .createQueryBuilder('punto')
    .leftJoinAndSelect('punto.puntoUsuarios', 'puntoUsuario')
    .leftJoinAndSelect('puntoUsuario.usuario', 'usuario')
    .leftJoinAndSelect('usuario.usuarioReemplazo', 'reemplazo')
    .where('punto.sesion = :idSesion', { idSesion })
    .getMany();

  //console.log(`✅ Se encontraron ${puntos.length} puntos en la sesión`);

  const puntoUsuariosAActualizar: PuntoUsuario[] = [];

  for (const punto of puntos) {
    for (const pu of punto.puntoUsuarios) {
      const esTitular = pu.usuario.id_usuario === idUsuario;
      const esReemplazo = pu.usuario.usuarioReemplazo?.id_usuario === idUsuario;

      if (esTitular || esReemplazo) {
        //console.log(`➡️ Actualizando PU ${pu.id_punto_usuario} (${esTitular ? 'titular' : 'reemplazo'}) de ${pu.es_principal} a ${!pu.es_principal}`);
        pu.es_principal = !pu.es_principal;
        puntoUsuariosAActualizar.push(pu);
      } else {
        //console.log(`↪️ Ignorado PU ${pu.id_punto_usuario}: titular=${pu.usuario.id_usuario}, reemplazo=${pu.usuario.usuarioReemplazo?.id_usuario}`);
      }
    }
  }

  if (puntoUsuariosAActualizar.length === 0) {
    //console.log(`⚠️ No se encontraron registros coincidentes para actualizar`);
    throw new NotFoundException('No se encontraron registros para actualizar');
  }

  await this.dataSource.getRepository(PuntoUsuario).save(puntoUsuariosAActualizar);

  //console.log(`✅ Se actualizaron ${puntoUsuariosAActualizar.length} registros de puntoUsuario`);
}


}
