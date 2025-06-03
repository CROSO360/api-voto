import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Sesion } from './sesion.entity';
import { BaseController } from 'src/commons/commons.controller';
import { SesionService } from './sesion.service';
import { BaseService } from 'src/commons/commons.service';
import { Response } from 'express';

@Controller('sesion')
export class SesionController extends BaseController<Sesion> {
  constructor(private readonly sesionService: SesionService) {
    super();
  }

  getService(): BaseService<Sesion> {
    return this.sesionService;
  }

  @Get('reporte/:id')
  async generarReporte(@Param('id') id: number, @Res() res: Response) {
    try {
      const buffer = await this.sesionService.generarReporteSesion(id);

      // Generar timestamp único
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\..+/, '')
        .replace('T', '_');

      const nombreArchivo = `reporte_sesion_${id}_${timestamp}.pdf`;

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${nombreArchivo}`,
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error generando el reporte PDF',
      );
    }
  }
}
