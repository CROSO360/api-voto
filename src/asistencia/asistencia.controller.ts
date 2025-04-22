import { Body, Controller, Param, Post } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { Asistencia } from './asistencia.entity';
import { AsistenciaService } from './asistencia.service';
import { BaseService } from 'src/commons/commons.service';

@Controller('asistencia')
export class AsistenciaController extends BaseController<Asistencia> {
  constructor(private readonly asistenciaService: AsistenciaService) {
    super();
  }

  getService(): BaseService<Asistencia> {
    return this.asistenciaService;
  }

  // ✅ Generar asistencias con los miembros del OCS
  @Post('generar/:idSesion')
  generarAsistencias(@Param('idSesion') idSesion: number) {
    return this.asistenciaService.generarAsistencias(+idSesion);
  }

  // 🔄 Sincronizar asistencias con la lista recibida del frontend
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

  // ❌ Eliminar todas las asistencias de una sesión
  @Post('eliminar/:idSesion')
  eliminarAsistencias(@Param('idSesion') idSesion: number) {
    return this.asistenciaService.eliminarAsistencias(+idSesion);
  }
}
