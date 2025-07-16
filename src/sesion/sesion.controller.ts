// ==============================
// Importaciones
// ==============================

import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { Sesion } from './sesion.entity';
import { SesionService } from './sesion.service';
import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';

// ==============================
// Controlador de Sesiones
// ==============================

@Controller('sesion')
export class SesionController extends BaseController<Sesion> {
  constructor(private readonly sesionService: SesionService) {
    super();
  }

  /**
   * Devuelve el servicio específico para esta entidad.
   */
  getService(): BaseService<Sesion> {
    return this.sesionService;
  }

  /**
   * Endpoint para generar el PDF de reporte de una sesión finalizada.
   * Responde con el archivo directamente como descarga.
   * 
   * @param id ID de la sesión
   * @param res Objeto de respuesta de Express
   */
  @Get('reporte/:id')
  async generarReporte(@Param('id') id: number, @Res() res: Response) {
    try {
      const buffer = await this.sesionService.generarReporteSesion(id);

      // Generar nombre de archivo con timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\..+/, '')
        .replace('T', '_');

      const nombreArchivo = `reporte_sesion_${id}_${timestamp}.pdf`;

      // Configurar headers de respuesta
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${nombreArchivo}`,
        'Content-Length': buffer.length,
      });

      // Enviar archivo al cliente
      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error generando el reporte PDF',
      );
    }
  }

  @Get('generar-codigo')
  async generarCodigo() {
    try {
      const codigo = await this.sesionService.generarCodigoUnicoSesion();
      return { codigo };
    } catch (error) {
      throw error;
    }
  }
  
}
