// =======================================================
// DTO: UserLoginDto
// Define los campos necesarios para el login de votantes
// =======================================================

import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  codigo: string;

  @IsString()
  cedula: string;
}
