// =======================================================
// DTO: AdminLoginDto
// Define los campos necesarios para el login de administradores
// =======================================================

import { IsString } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  codigo: string;

  @IsString()
  contrasena: string;
}
