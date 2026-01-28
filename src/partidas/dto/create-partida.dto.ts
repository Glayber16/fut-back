export enum ResultadoPartida {
  VITORIA = 'VITORIA',
  DERROTA = 'DERROTA',
  EMPATE = 'EMPATE',
}

export class CreatePartidaDto {
  timeCasa: string;
  rival: string;
  data: string;
  campeonato: string;
  estadio: string;
  placarCasa?: number;
  placarFora?: number;
  resultado: ResultadoPartida;
  colegasNome?: string[];
}
