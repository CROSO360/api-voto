// =======================================================
// DTO: VotoDto
// Define los campos necesarios para registrar un voto
// =======================================================

import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class VotoDto {
  @IsNumber()
  idUsuario: number;

  @IsNumber()
  votante: number;

  @IsString()
  codigo: string;

  @IsNumber()
  punto: number;

  @IsString()
  @IsOptional()
  @IsIn(['afavor', 'encontra', 'abstencion', null])
  opcion: string | null;

  es_razonado: boolean;
}
