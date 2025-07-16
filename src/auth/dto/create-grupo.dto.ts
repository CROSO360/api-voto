// create-grupo.dto.ts

import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGrupoDto {
  @IsInt()
  idSesion: number;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsArray()
  @IsInt({ each: true })
  puntos: number[];
}
