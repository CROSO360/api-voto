// =======================================================
// IMPORTACIONES
// =======================================================

import { Body, Controller, Param, Post } from '@nestjs/common';
import { Asistencia } from './asistencia.entity';
import { AsistenciaService } from './asistencia.service';
import { BaseService } from 'src/commons/commons.service';
import { BaseController } from 'src/commons/commons.controller';

// =======================================================
// CONTROLADOR: AsistenciaController
// =======================================================

@Controller('asistencia')
export class AsistenciaController extends BaseController<Asistencia> {
  constructor(private readonly asistenciaService: AsistenciaService) {
    super();
  }

  getService(): BaseService<Asistencia> {
    return this.asistenciaService;
  }

  // ===================================================
  // POST: /asistencia/generar/:idSesion
  // Genera asistencias con todos los miembros del OCS
  // ===================================================
  @Post('generar/:idSesion')
  generarAsistencias(@Param('idSesion') idSesion: number) {
    return this.asistenciaService.generarAsistencias(+idSesion);
  }

  // ===================================================
  // POST: /asistencia/sincronizar/:idSesion
  // Sincroniza asistentes extra desde la vista del frontend
  // ===================================================
  @Post('sincronizar/:idSesion')
  sincronizarAsistencias(
    @Param('idSesion') idSesion: number,
    @Body() body: { usuariosSeleccionados: number[] },
  ) {
    return this.asistenciaService.sincronizarAsistencias(
      +idSesion,
      body.usuariosSeleccionados,
    );
  }

  // ===================================================
  // POST: /asistencia/eliminar/:idSesion
  // Elimina todas las asistencias asociadas a una sesión
  // ===================================================
  @Post('eliminar/:idSesion')
  eliminarAsistencias(@Param('idSesion') idSesion: number) {
    return this.asistenciaService.eliminarAsistencias(+idSesion);
  }
}
