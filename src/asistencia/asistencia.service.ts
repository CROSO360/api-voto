import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons/commons.service';
import { Repository } from 'typeorm';
import { Asistencia } from './asistencia.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Miembro } from 'src/miembro/miembro.entity';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class AsistenciaService extends BaseService<Asistencia> {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,
    @InjectRepository(Sesion) private sesionRepo: Repository<Sesion>,
    @InjectRepository(Miembro) private miembroRepo: Repository<Miembro>,
  ) {
    super();
  }

  getRepository(): Repository<Asistencia> {
    return this.asistenciaRepo;
  }

  async generarAsistencias(idSesion: number): Promise<Asistencia[]> {
    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
    });
    if (!sesion) throw new BadRequestException('La sesión no existe.');

    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario'],
    });
    if (!miembros.length)
      throw new BadRequestException(
        'No hay miembros registrados para generar asistencias.',
      );

    const nuevasAsistencias: Asistencia[] = [];

    for (const miembro of miembros) {
      const yaExiste = await this.asistenciaRepo.findOne({
        where: {
          sesion: { id_sesion: idSesion },
          usuario: { id_usuario: miembro.usuario.id_usuario },
        },
        relations: ['sesion', 'usuario'],
      });

      if (!yaExiste) {
        const asistencia = this.asistenciaRepo.create({
          sesion,
          usuario: miembro.usuario,
          tipo_asistencia: null, // Se define luego: presencial, remoto, ausente
          estado: true,
          status: true,
        });

        nuevasAsistencias.push(asistencia);
      }
    }

    return await this.asistenciaRepo.save(nuevasAsistencias);
  }

  async sincronizarAsistencias(
    idSesion: number,
    usuariosSeleccionados: number[],
  ): Promise<void> {
    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
    });
    if (!sesion) throw new BadRequestException('La sesión no existe.');

    // IDs de los miembros oficiales del OCS
    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario'],
    });
    const idsMiembros = miembros.map((m) => m.usuario.id_usuario);

    // Asistencias registradas para la sesión actual
    const asistencias = await this.asistenciaRepo.find({
      where: { sesion: { id_sesion: idSesion } },
      relations: ['usuario'],
    });
    const idsAsistentesActuales = asistencias.map((a) => a.usuario.id_usuario);

    // 🗑️ Eliminar asistencias que NO están en la lista nueva y NO son miembros
    for (const asistencia of asistencias) {
      const idUsuario = asistencia.usuario.id_usuario;
      if (
        !usuariosSeleccionados.includes(idUsuario) &&
        !idsMiembros.includes(idUsuario)
      ) {
        await this.asistenciaRepo.delete(asistencia.id_asistencia);
      }
    }

    // ➕ Agregar asistencias nuevas (solo si no existen aún y no son miembros)
    for (const idUsuario of usuariosSeleccionados) {
      if (
        !idsAsistentesActuales.includes(idUsuario) &&
        !idsMiembros.includes(idUsuario)
      ) {
        const asistencia = this.asistenciaRepo.create({
          sesion,
          usuario: { id_usuario: idUsuario } as Usuario, // solo necesitamos el ID
          tipo_asistencia: null,
          estado: true,
          status: true,
        });
        await this.asistenciaRepo.save(asistencia);
      }
    }
  }

  async eliminarAsistencias(idSesion: number): Promise<void> {
    const sesion = await this.sesionRepo.findOne({ where: { id_sesion: idSesion } });
    if (!sesion) throw new BadRequestException('La sesión no existe.');
  
    await this.asistenciaRepo.delete({ sesion: { id_sesion: idSesion } });
  }
  
}
