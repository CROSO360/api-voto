import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/commons/commons.controller';
import { PuntoService } from './punto.service';
import { BaseService } from 'src/commons/commons.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Punto } from './punto.entity';

@Controller('punto')
export class PuntoController {
  constructor(private readonly puntoService: PuntoService) {}


  @Get('all')
  @UseGuards(AuthGuard)
  async findAll(@Query() query: any): Promise<Punto[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    return await this.puntoService.findAll(relations);
  }

  @Get('find/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id): Promise<Punto> {
    return await this.puntoService.findOne({ id });
  }

  @Get('findOneBy')
  @UseGuards(AuthGuard)
  async findOneBy(@Query() query?: any): Promise<Punto> {
    const relations: string[] = query.relations
      ? query.relations.split(',')
      : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;

    return await this.puntoService.findOneBy(filteredQuery, relations);
  }

  @Get('findAllBy')
  @UseGuards(AuthGuard)
  async findAllBy(@Query() query?: any): Promise<Punto[]> {
    const relations: string[] = query.relations
      ? query.relations.split(',')
      : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;

    return await this.puntoService.findAllBy(filteredQuery, relations);
  }

  @Post('save')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() entity: Punto): Promise<Punto> {
    return await this.puntoService.save(entity);
  }

  @Post('save/many')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async saveMany(@Body() entities: Punto[]): Promise<Punto[]> {
    return await this.puntoService.saveMany(entities);
  }

  @Post('delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: any) {
    return this.puntoService.delete(id);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  async count(): Promise<number> {
    return await this.puntoService.count();
  }

  @Get('resultado/:idPunto')
  @UseGuards(AuthGuard)
  async getResultadoPunto(@Param('idPunto') idPunto: number): Promise<any> {
    return await this.puntoService.getResultadosPunto(idPunto);
  }

  @Post('registrar-resultado')
  @UseGuards(AuthGuard)
  async registerResultadosPunto(
    @Body() body: { idPunto: number },
  ): Promise<any> {
    const { idPunto } = body;
    return await this.puntoService.registerResultadosPunto(idPunto);
  }
}
