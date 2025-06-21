// =======================================================
// DTO: ResultadoManualDto
// Utilizado para registrar manualmente el resultado de un punto
// =======================================================

import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class ResultadoManualDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El id del punto es obligatorio' })
  id_punto: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
  id_usuario: number;

  @IsString()
  @IsIn(['aprobada', 'rechazada', 'pendiente'], { message: 'El resultado debe ser: aprobada, rechazada o pendiente' })
  resultado: string;

  voto_manual?: boolean; // este campo es opcional, se asigna automáticamente si es necesario
}
