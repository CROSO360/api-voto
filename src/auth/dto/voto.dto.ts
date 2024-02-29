import { IsIn, IsOptional, IsString } from "class-validator";
import { Punto } from "src/punto/punto.entity";

export class VotoDto {

  id_usuario: number;  

  @IsString()
  codigo: string;

  punto: number;

  @IsString()
  @IsOptional() // Marca el campo como opcional
  @IsIn(['afavor', 'encontra', 'abstinencia', null]) // Agrega null como una de las opciones permitidas
  opcion: string | null;
}