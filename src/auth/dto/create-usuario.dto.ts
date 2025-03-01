import { IsString, IsNotEmpty } from 'class-validator';
import { Usuario } from 'src/usuario/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  cedula: string;

  @IsString()
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  usuarioReemplazo: Usuario;
}