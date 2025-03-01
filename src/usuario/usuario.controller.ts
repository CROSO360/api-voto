import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Usuario } from './usuario.entity';
import { BaseController } from 'src/commons/commons.controller';
import { UsuarioService } from './usuario.service';
import { BaseService } from 'src/commons/commons.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUsuarioDto } from 'src/auth/dto/create-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  async findAll(@Query() query: any): Promise<Usuario[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    return this.usuarioService.findAll(relations);
  }

  @Get('find/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  @Get('findOneBy')
  @UseGuards(AuthGuard)
  async findOneBy(@Query() query: any): Promise<Usuario> {
    const relations = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;
    return this.usuarioService.findOneBy(filteredQuery, relations);
  }

  @Get('findAllBy')
  @UseGuards(AuthGuard)
  async findAllBy(@Query() query: any): Promise<Usuario[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;
    return this.usuarioService.findAllBy(filteredQuery, relations);
  }

  @Post('save')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.createUsuario(createUsuarioDto);
  }

  /*@Put('update/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateUsuarioDto: Partial<CreateUsuarioDto>): Promise<Usuario> {
    return this.usuarioService.updateUsuario(id, updateUsuarioDto);
  }*/

  @Post('update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() entity: Usuario): Promise<Usuario> {
    return await this.usuarioService.updateUsuario(entity);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number): Promise<void> {
    return this.usuarioService.deleteUsuario(id);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  async count(): Promise<number> {
    return this.usuarioService.count();
  }

  @Get('reemplazos-disponibles/:id')
  async obtenerReemplazosDisponibles(@Param('id') id: number): Promise<Usuario[]> {
    return await this.usuarioService.obtenerReemplazosDisponibles(id);
  }

}
