import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { Punto } from "src/punto/punto.entity";

export class VotoDto {
  @IsNumber()
  id_usuario: number;

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