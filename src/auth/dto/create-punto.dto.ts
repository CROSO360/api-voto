// =======================================================
// DTO: CreatePuntoDto
// Define los campos requeridos para crear un punto
// =======================================================

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePuntoDto {
  @IsInt()
  @Min(1, { message: 'El id_sesion debe ser un número entero mayor a 0' })
  idSesion: number;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del punto no puede estar vacío' })
  nombre: string;

  @IsString()
  @IsOptional()
  detalle?: string;

  @IsBoolean()
  @IsOptional()
  es_administrativa?: boolean;
}
