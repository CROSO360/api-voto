// =======================================================
// IMPORTACIONES
// =======================================================

import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseService } from './commons.service';
import { AuthGuard } from 'src/auth/auth.guard';

// =======================================================
// CONTROLADOR BASE GENÉRICO
// =======================================================

export abstract class BaseController<T> {
  // Cada controlador hijo debe implementar su servicio correspondiente
  abstract getService(): BaseService<T>;

  // Obtener todos los registros, con relaciones opcionales
  @Get('all')
  @UseGuards(AuthGuard)
  async findAll(@Query() query: any): Promise<T[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    return await this.getService().findAll(relations);
  }

  // Buscar uno por ID
  @Get('find/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id): Promise<T> {
    return await this.getService().findOne({ id });
  }

  // Buscar uno por condición y relaciones
  @Get('findOneBy')
  @UseGuards(AuthGuard)
  async findOneBy(@Query() query?: any): Promise<T> {
    const relations: string[] = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;

    return await this.getService().findOneBy(filteredQuery, relations);
  }

  // Buscar múltiples por condición y relaciones
  @Get('findAllBy')
  @UseGuards(AuthGuard)
  async findAllBy(@Query() query?: any): Promise<T[]> {
    const relations: string[] = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;

    return await this.getService().findAllBy(filteredQuery, relations);
  }

  // Guardar un registro
  @Post('save')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() entity: T): Promise<T> {
    return await this.getService().save(entity);
  }

  // Guardar múltiples registros
  @Post('save/many')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async saveMany(@Body() entities: T[]): Promise<T[]> {
    return await this.getService().saveMany(entities);
  }

  // Eliminar un registro
  @Post('delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: any) {
    return this.getService().delete(id);
  }

  // Contar registros
  @Get('count')
  @UseGuards(AuthGuard)
  async count(): Promise<number> {
    return await this.getService().count();
  }
}
