import { IsString, IsNotEmpty, IsNumber, IsDate, isBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ResultadoManualDto {
  @IsNumber()
  @IsNotEmpty()
  id_punto: number;

  @IsNumber()
  @IsNotEmpty()
  id_usuario: number;

  @IsString()
  @IsIn(['aprobada', 'rechazada', 'pendiente'])
  resultado: string;

  voto_manual?: boolean;
}
