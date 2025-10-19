// =======================================================
// IMPORTACIONES
// =======================================================

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, IsNull } from 'typeorm';

// Servicios y entidades relacionados
import { BaseService } from 'src/commons/commons.service';
import { Asistencia } from './asistencia.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Miembro } from 'src/miembro/miembro.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { PuntoUsuarioService } from 'src/punto-usuario/punto-usuario.service';
import { Punto } from 'src/punto/punto.entity';
import { Resultado } from 'src/resultado/resultado.entity';

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
    private dataSource: DataSource,
    private puntoUsuarioService: PuntoUsuarioService,
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
          //tipo_asistencia: null, // Se define después
          estado: true,
          status: true,
        });

        nuevasAsistencias.push(asistencia);
      }
    }

    // ⬇️ Cambia SOLO el guardado por insert + orIgnore()
    if (nuevasAsistencias.length) {
      await this.asistenciaRepo
        .createQueryBuilder()
        .insert()
        .into(Asistencia)
        .values(
          nuevasAsistencias.map((a) => ({
            // ✅ usar relaciones, no columnas primitivas
            sesion: { id_sesion: sesion.id_sesion },
            usuario: { id_usuario: a.usuario.id_usuario },

            // ✅ usar boolean, no 0/1
            estado: !!a.estado,
            status: !!a.status,

            // tipo_asistencia: a.tipo_asistencia ?? null, // si aplica y es nullable
          })),
        )
        .orIgnore() // ignora si choca con UNIQUE (sesion, usuario)
        .execute();
    }

    return await this.asistenciaRepo.find({
      where: { sesion: { id_sesion: idSesion } },
      relations: ['sesion', 'usuario'],
      order: { id_asistencia: 'ASC' },
    });
  }

  // ===================================================
  // MÉTODO: sincronizarAsistencias
  // Agrega o elimina usuarios extras, manteniendo miembros
  // ===================================================
  async sincronizarAsistencias(
    idSesion: number,
    usuariosSeleccionados: number[],
  ): Promise<void> {
    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
    });
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
    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
    });
    if (!sesion) throw new BadRequestException('La sesión no existe.');

    await this.asistenciaRepo.delete({ sesion: { id_sesion: idSesion } });
  }

  // asistencia.service.ts
  async guardarAsistencias(
    idSesion: number,
    payload: { id_asistencia: number; tipo_asistencia: string }[],
  ) {
    await this.dataSource.transaction(async (manager) => {
      const asistenciaRepo = manager.getRepository(Asistencia);

      for (const { id_asistencia, tipo_asistencia } of payload) {
        await asistenciaRepo.update({ id_asistencia }, { tipo_asistencia });
      }

      await this.puntoUsuarioService.syncEstadoBySesion(idSesion, manager);

      const puntosPendientes = await manager.getRepository(Punto).find({
        where: {
          sesion: { id_sesion: idSesion },
          resultado: IsNull(),
        },
      });

      if (!puntosPendientes.length) {
        return;
      }

      const asistencias = await asistenciaRepo.find({
        where: {
          sesion: { id_sesion: idSesion },
          estado: true,
          status: true,
        },
        relations: ['usuario', 'usuario.grupoUsuario'],
      });

      const contarPresentes = (excluirTrabajador: boolean) =>
        asistencias.filter((asistencia) => {
          const tipo = (asistencia.tipo_asistencia || '').toLowerCase();
          if (tipo !== 'presente') return false;
          if (!excluirTrabajador) return true;
          const grupo = (asistencia.usuario?.grupoUsuario?.nombre || '').toLowerCase();
          return grupo !== 'trabajador';
        }).length;

      const resultadoRepo = manager.getRepository(Resultado);
      const to2 = (n: number) => Math.round(n * 100) / 100;

      for (const punto of puntosPendientes) {
        const presentes = contarPresentes(!!punto.es_administrativa);

        let resultado = await resultadoRepo.findOne({
          where: { id_punto: punto.id_punto },
        });

        if (!resultado) {
          resultado = resultadoRepo.create({ id_punto: punto.id_punto });
        }

        resultado.n_mitad_miembros_presente = to2(Math.ceil(presentes / 2));
        await resultadoRepo.save(resultado);
      }
    });
  }
}
