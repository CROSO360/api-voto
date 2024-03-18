import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Punto } from './punto.entity';
import { BaseController } from 'src/commons/commons.controller';
import { PuntoService } from './punto.service';
import { BaseService } from 'src/commons/commons.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('punto')
export class PuntoController extends BaseController<Punto> {

    constructor(private readonly puntoService: PuntoService) {
        super();
    }

    getService(): BaseService<Punto> {
        return this.puntoService;
    }

    @Get('resultado/:idPunto')
    @UseGuards(AuthGuard)
    async getResultadoPunto(@Param('idPunto') idPunto: number): Promise<any> {
        return await this.puntoService.getResultadosPunto(idPunto);
    }

    @Post('registrar-resultado')
    @UseGuards(AuthGuard)
    async registerResultadosPunto(@Body() body: { idPunto: number }): Promise<any> {
        const { idPunto } = body;
        return await this.puntoService.registerResultadosPunto(idPunto);
    }

}
