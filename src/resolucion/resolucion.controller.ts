// =======================================================
// IMPORTACIONES
// =======================================================

import { Body, Controller, Patch, UseGuards } from '@nestjs/common';

import { BaseController } from 'src/commons/commons.controller';
import { BaseService } from 'src/commons/commons.service';

import { Resolucion } from './resolucion.entity';
import { ResolucionService } from './resolucion.service';

import { UpdateResolucionDto } from 'src/auth/dto/update-resolucion.dto';
import { AuthGuard } from 'src/auth/auth.guard';

// =======================================================
// CONTROLADOR: ResolucionController
// =======================================================

@Controller('resolucion')
export class ResolucionController extends BaseController<Resolucion> {

  constructor(private readonly resolucionService: ResolucionService) {
    super();
  }

  getService(): BaseService<Resolucion> {
    return this.resolucionService;
  }

  //Endpoint para actualizar resolución
  @Patch('actualizar')
  @UseGuards(AuthGuard)
  async actualizarResolucion(
    @Body() dto: UpdateResolucionDto,
  ): Promise<{ message: string }> {
    await this.resolucionService.actualizarResolucion(dto);
    return { message: 'Resolución actualizada correctamente' };
  }
}
