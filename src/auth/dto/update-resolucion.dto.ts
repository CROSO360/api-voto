import { IsString, IsNotEmpty, IsNumber, IsDate, isBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateResolucionDto {
  @IsNumber()
  @IsNotEmpty()
  id_punto: number;

  @IsNumber()
  @IsNotEmpty()
  id_usuario: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fecha: Date;

  voto_manual?: boolean;
}
