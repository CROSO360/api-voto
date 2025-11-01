import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ResultadoManualDto } from './resultado-manual.dto';
import { VotoDto } from './voto.dto';

export enum GrupoResultadoFuente {
  AUTOMATICO = 'automatico',
  MANUAL = 'manual',
  HIBRIDO = 'hibrido',
}

export class CalcularResultadosGrupoDto {
  @IsInt()
  idGrupo: number;

  @IsEnum(GrupoResultadoFuente)
  modoCalculo: GrupoResultadoFuente;

  @IsOptional()
  @IsInt()
  idUsuario?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultadoManualDto)
  resultadosManuales?: ResultadoManualDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VotoDto)
  votos?: VotoDto[];

  @IsOptional()
  opciones?: {
    overrideResultado?: 'aprobada' | 'rechazada' | 'pendiente' | 'empate';
    recalcularVotos?: boolean;
  };
}
