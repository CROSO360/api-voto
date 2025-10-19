// =======================================================
// DTO: ResultadoManualDto
// Utilizado para registrar manualmente el resultado de un punto
// =======================================================

import { IsString, IsNotEmpty, IsNumber, IsIn, IsOptional } from 'class-validator';

export class ResultadoManualDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El id del punto es obligatorio' })
  id_punto: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
  id_usuario: number;

  @IsString()
  @IsIn(['aprobada', 'rechazada', 'pendiente', 'empate'], {
    message: 'El resultado debe ser: aprobada, rechazada, pendiente o empate',
  })
  resultado: 'aprobada' | 'rechazada' | 'pendiente' | 'empate';

  @IsOptional()
  @IsString()
  fuente_resultado?: string; // opcional, permite registrar la fuente del resultado
}
