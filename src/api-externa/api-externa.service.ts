import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiExternaService {
  private readonly logger = new Logger(ApiExternaService.name);
  private readonly baseUrl = 'https://v3.football.api-sports.io';

  private get headers() {
    return {
      'x-rapidapi-host': process.env.chave_api_host,
      'x-rapidapi-key': process.env.chave_api,
    };
  }

  async getDadosTime(timeCasaNome: string, dataIso: string) {
    try {
      const timeId = await this.getIdTime(timeCasaNome);

      if (!timeId) {
        this.logger.warn(`Time não encontrado na API: ${timeCasaNome}`);
        return null;
      }

      const dataFormatada = dataIso.split('T')[0];

      const response = await axios.get(`${this.baseUrl}/fixtures`, {
        headers: this.headers,
        params: {
          team: timeId,
          date: dataFormatada,
          timezone: 'America/Sao_Paulo',
        },
      });

      const jogos = response.data.response;

      if (!jogos || jogos.length === 0) {
        this.logger.warn(
          `Nenhum jogo encontrado para ${timeCasaNome} em ${dataFormatada}`,
        );
        return null;
      }

      const jogo = jogos[0];

      return {
        escudoTimeCasa: jogo.teams.home.logo,
        escudoRival: jogo.teams.away.logo,
        data: jogo.fixture.date,
      };
    } catch (error) {
      this.logger.error(`Erro ao consultar API externa: ${error.message}`);
      return null;
    }
  }

  private async getIdTime(nome: string): Promise<number | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/teams`, {
        headers: this.headers,
        params: { search: nome },
      });

      if (response.data.response && response.data.response.length > 0) {
        return response.data.response[0].team.id;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
