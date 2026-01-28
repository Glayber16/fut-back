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

  async getDadosTime(nomeTime: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/teams`, {
        headers: this.headers,
        params: { search: nomeTime },
      });

      const times = response.data.response;
      if (!times || times.length === 0) {
        this.logger.warn(`Time não encontrado na API: ${nomeTime}`);
        return null;
      }
      return times[0].team.logo;
    } 
    catch (error) {
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
