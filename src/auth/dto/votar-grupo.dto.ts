import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class VotarGrupoDto {
  @IsString()
  codigo: string;

  @IsInt()
  idUsuario: number;

  @IsEnum(['afavor', 'encontra', 'abstencion', null])
  opcion: 'afavor' | 'encontra' | 'abstencion' | null;

  @IsBoolean()
  es_razonado: boolean;

  @IsInt()
  votante: number;
}

export interface VotarGrupoRespuesta {
  mensaje: string;
  ids: number[];
}