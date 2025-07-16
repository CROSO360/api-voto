// ==============================
// Importaciones
// ==============================

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUsuarioDto } from 'src/auth/dto/create-usuario.dto';

// ==============================
// Controlador de Usuario
// ==============================

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // ==============================
  // Consultas GET
  // ==============================

  /**
   * Obtiene todos los usuarios con sus relaciones (si se especifican).
   * Ejemplo: GET /usuario/all?relations=grupoUsuario,usuarioReemplazo
   */
  @Get('all')
  @UseGuards(AuthGuard)
  async findAll(@Query() query: any): Promise<Usuario[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    return this.usuarioService.findAll(relations);
  }

  /**
   * Busca un usuario por su ID.
   */
  @Get('find/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  /**
   * Busca un usuario por campos dinámicos (query params).
   * Ejemplo: GET /usuario/findOneBy?codigo=U001&relations=grupoUsuario
   */
  @Get('findOneBy')
  @UseGuards(AuthGuard)
  async findOneBy(@Query() query: any): Promise<Usuario> {
    const relations = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;
    return this.usuarioService.findOneBy(filteredQuery, relations);
  }

  /**
   * Busca múltiples usuarios por condiciones personalizadas.
   */
  @Get('findAllBy')
  @UseGuards(AuthGuard)
  async findAllBy(@Query() query: any): Promise<Usuario[]> {
    const relations = query.relations ? query.relations.split(',') : [];
    const filteredQuery = { ...query };
    delete filteredQuery.relations;
    return this.usuarioService.findAllBy(filteredQuery, relations);
  }

  /**
   * Obtiene el número total de usuarios.
   */
  @Get('count')
  @UseGuards(AuthGuard)
  async count(): Promise<number> {
    return this.usuarioService.count();
  }

  /**
   * Obtiene los posibles reemplazos válidos para un usuario.
   */
  @Get('reemplazos-disponibles/:id')
  async obtenerReemplazosDisponibles(@Param('id') id: number): Promise<Usuario[]> {
    return await this.usuarioService.obtenerReemplazosDisponibles(id);
  }

  // ==============================
  // Creación y actualización
  // ==============================

  /**
   * Crea un nuevo usuario.
   */
  @Post('save')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.createUsuario(createUsuarioDto);
  }

  /**
   * Actualiza los datos de un usuario.
   * Requiere enviar el objeto completo del usuario.
   */
  @Post('update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() entity: Usuario): Promise<Usuario> {
    return await this.usuarioService.updateUsuario(entity);
  }

  // ==============================
  // Eliminación
  // ==============================

  /**
   * Elimina un usuario por su ID.
   */
  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number): Promise<void> {
    return this.usuarioService.deleteUsuario(id);
  }

  @Get('generar-codigo')
  async generarCodigo() {
    try {
      const codigo = await this.usuarioService.generarCodigoUnicoUsuario();
      return { codigo };
    } catch (error) {
      throw error;
    }
  }
}
