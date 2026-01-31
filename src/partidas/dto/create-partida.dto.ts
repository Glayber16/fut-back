import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum ResultadoPartida {
  VITORIA = 'VITORIA',
  DERROTA = 'DERROTA',
  EMPATE = 'EMPATE',
}

export class CreatePartidaDto {
  @IsString()
  timeCasa: string;

  @IsString()
  rival: string;

  @IsString()
  data: string;

  @IsString()
  campeonato: string;

  @IsString()
  estadio: string;

  @IsOptional()
  placarCasa?: number;

  @IsOptional()
  placarFora?: number;

  @IsEnum(ResultadoPartida)
  resultado: ResultadoPartida;

  @IsOptional()
  @IsArray()
  colegasNome?: string[];
}
