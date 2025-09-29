// ==========================================
// IMPORTACIONES
// ==========================================
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PuntoService } from './punto.service';
import { Punto } from './punto.entity';
import { CreatePuntoDto } from 'src/auth/dto/create-punto.dto';
import { ResultadoManualDto } from 'src/auth/dto/resultado-manual.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { VotoDto } from 'src/auth/dto/voto.dto';

// ==========================================
// CONTROLADOR: PuntoController
// ==========================================
@Controller('punto')
export class PuntoController {
  constructor(private readonly puntoService: PuntoService) {}

  // ===============================
  // CONSULTAS GENERALES
  // ===============================

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
    const relations = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;
    return await this.puntoService.findOneBy(filteredQuery, relations);
  }

  @Get('findAllBy')
  @UseGuards(AuthGuard)
  async findAllBy(@Query() query?: any): Promise<Punto[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;
    return await this.puntoService.findAllBy(filteredQuery, relations);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  async count(): Promise<number> {
    return await this.puntoService.count();
  }

  // ===============================
  // GUARDADO Y CREACIÓN
  // ===============================

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

  @Post('crear')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async crearPunto(@Body() createPuntoDto: CreatePuntoDto) {
    return await this.puntoService.crearPunto(createPuntoDto);
  }

  // ===============================
  // GESTIÓN DE PUNTOS
  // ===============================

  @Post('eliminar/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async eliminarPunto(@Param('id') idPunto: number) {
    return await this.puntoService.eliminarPunto(idPunto);
  }

  @Post('reordenar')
  @UseGuards(AuthGuard)
  async moverPunto(
    @Body()
    body: {
      idPunto: number;
      posicionInicial: number;
      posicionFinal: number;
    },
  ) {
    return await this.puntoService.reordenarPunto(
      body.idPunto,
      body.posicionInicial,
      body.posicionFinal,
    );
  }

  // POST /punto/reconsideracion/:id
  @Post('reconsideracion/:id')
  @UseGuards(AuthGuard)
  async crearReconsideracion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Punto> {
    return this.puntoService.crearReconsideracion(id);
  }

  // POST /punto/reconsideracion/:id/aprobar
  @Post('reconsideracion/aprobar/:id')
  @UseGuards(AuthGuard)
  async aprobarReconsideracion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Punto> {
    return this.puntoService.aprobarReconsideracion(id);
  }

  // ===============================
  // RESULTADOS
  // ===============================

  @Post('calcular-resultados/:idPunto/:idUsuario')
  async calcularResultados(
    @Param('idPunto', ParseIntPipe) idPunto: number,
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    await this.puntoService.calcularResultados(idPunto, idUsuario);
    return { message: 'Resultados actualizados correctamente' };
  }

  @Post('resultado-manual')
  @UseGuards(AuthGuard)
  async registrarResultadoManual(@Body() dto: ResultadoManualDto) {
    await this.puntoService.calcularResultadosManual(dto);
  }

  @Get('resultado/:idPunto')
  @UseGuards(AuthGuard)
  async getResultadoPunto(@Param('idPunto') idPunto: number): Promise<any> {
    return await this.puntoService.getResultadosPunto(idPunto);
  }

  @Post('resultado-hibrido/:idPunto')
  @UseGuards(AuthGuard)
  async calcularResultadosHibrido(
    @Param('idPunto', ParseIntPipe) idPunto: number,
    @Body() votos: VotoDto[],
  ): Promise<void> {
    await this.puntoService.calcularResultadosHibrido(idPunto, votos);
  }

@Get('habilitado/:idPunto')
  async puntoHabilitado(
    @Param('idPunto', ParseIntPipe) idPunto: number,
  ) {
    const habilitado = await this.puntoService.estaHabilitado(idPunto);
    return { id_punto: idPunto, habilitado };
  }

  @Get('resumen-base/:id')
  async getResumenExcel(@Param('id') id: number) {
    return this.puntoService.getResumenBase(+id); 
  }

  @Get('resumen-ponderado/:id')
  async getResumenPonderado(@Param('id') id: number) { 
    return this.puntoService.getResumenPonderado(+id); 
  }

  
}
