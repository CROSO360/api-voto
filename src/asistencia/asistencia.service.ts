// =======================================================
// IMPORTACIONES
// =======================================================

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Servicios y entidades relacionados
import { BaseService } from 'src/commons/commons.service';
import { Asistencia } from './asistencia.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Miembro } from 'src/miembro/miembro.entity';
import { Usuario } from 'src/usuario/usuario.entity';

// =======================================================
// SERVICIO: AsistenciaService
// =======================================================

@Injectable()
export class AsistenciaService extends BaseService<Asistencia> {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,

    @InjectRepository(Sesion)
    private sesionRepo: Repository<Sesion>,

    @InjectRepository(Miembro)
    private miembroRepo: Repository<Miembro>,
  ) {
    super();
  }

  getRepository(): Repository<Asistencia> {
    return this.asistenciaRepo;
  }

  // ===================================================
  // MÉTODO: generarAsistencias
  // Genera asistencias iniciales para todos los miembros
  // ===================================================
  async generarAsistencias(idSesion: number): Promise<Asistencia[]> {
    const sesion = await this.sesionRepo.findOne({ where: { id_sesion: idSesion } });
    if (!sesion) throw new BadRequestException('La sesión no existe.');

    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario'],
    });
    if (!miembros.length)
      throw new BadRequestException('No hay miembros registrados para generar asistencias.');

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
          //tipo_asistencia: null, // Se define después
          estado: true,
          status: true,
        });

        nuevasAsistencias.push(asistencia);
      }
    }

    return await this.asistenciaRepo.save(nuevasAsistencias);
  }

  // ===================================================
  // MÉTODO: sincronizarAsistencias
  // Agrega o elimina usuarios extras, manteniendo miembros
  // ===================================================
  async sincronizarAsistencias(
    idSesion: number,
    usuariosSeleccionados: number[],
  ): Promise<void> {
    const sesion = await this.sesionRepo.findOne({ where: { id_sesion: idSesion } });
    if (!sesion) throw new BadRequestException('La sesión no existe.');

    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario'],
    });
    const idsMiembros = miembros.map((m) => m.usuario.id_usuario);

    const asistencias = await this.asistenciaRepo.find({
      where: { sesion: { id_sesion: idSesion } },
      relations: ['usuario'],
    });
    const idsAsistentesActuales = asistencias.map((a) => a.usuario.id_usuario);

    // 🗑️ Eliminar asistencias que no están seleccionadas ni son miembros
    for (const asistencia of asistencias) {
      const idUsuario = asistencia.usuario.id_usuario;
      if (
        !usuariosSeleccionados.includes(idUsuario) &&
        !idsMiembros.includes(idUsuario)
      ) {
        await this.asistenciaRepo.delete(asistencia.id_asistencia);
      }
    }

    // ➕ Agregar nuevas asistencias de usuarios extra
    for (const idUsuario of usuariosSeleccionados) {
      if (
        !idsAsistentesActuales.includes(idUsuario) &&
        !idsMiembros.includes(idUsuario)
      ) {
        const asistencia = this.asistenciaRepo.create({
          sesion,
          usuario: { id_usuario: idUsuario } as Usuario,
          tipo_asistencia: null,
          estado: true,
          status: true,
        });
        await this.asistenciaRepo.save(asistencia);
      }
    }
  }

  // ===================================================
  // MÉTODO: eliminarAsistencias
  // Borra todas las asistencias de una sesión
  // ===================================================
  async eliminarAsistencias(idSesion: number): Promise<void> {
    const sesion = await this.sesionRepo.findOne({ where: { id_sesion: idSesion } });
    if (!sesion) throw new BadRequestException('La sesión no existe.');

    await this.asistenciaRepo.delete({ sesion: { id_sesion: idSesion } });
  }
}
