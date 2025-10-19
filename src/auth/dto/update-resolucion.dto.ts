// =======================================================
// DTO: UpdateResolucionDto
// Actualiza una resolución existente asociada a un punto
// =======================================================

import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateResolucionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El id del punto es obligatorio' })
  id_punto: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
  id_usuario: number;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la resolución no puede estar vacío' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción de la resolución no puede estar vacía' })
  descripcion: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'La fecha de la resolución es obligatoria' })
  fecha: Date;

  // Fuente opcional para indicar c�mo se obtuvo el resultado (ej. manual, automatico)
  @IsOptional()
  @IsString()
  fuente_resultado?: string;
}
