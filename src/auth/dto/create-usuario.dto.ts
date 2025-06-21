// =======================================================
// DTO: CreateUsuarioDto
// Define los campos necesarios para registrar un nuevo usuario
// =======================================================

import { IsString, IsNotEmpty } from 'class-validator';
import { Usuario } from 'src/usuario/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El código de usuario es obligatorio' })
  codigo: string;

  @IsString()
  cedula: string; // puede considerarse encriptar en capa de servicio

  @IsString()
  contrasena: string; // se recomienda hashear antes de guardar

  @IsString()
  @IsNotEmpty({ message: 'Debe indicar si es administrador o votante' })
  tipo: string;

  usuarioReemplazo: Usuario; // Se permite enviar un objeto o solo el id en capa de servicio
}
