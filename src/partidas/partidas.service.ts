import { Injectable } from '@nestjs/common';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { PrismaService } from '../prisma.service';
import { ApiExternaService } from '../api-externa/api-externa.service';

@Injectable()
export class PartidasService {
  constructor(
    private prisma: PrismaService,
    private apiExterna: ApiExternaService,
  ) {}

  async create(createPartidaDto: CreatePartidaDto) {
    let escudoTimeCasa = '';
    let escudoRival = '';
    if (createPartidaDto.timeCasa) {
      const logo = await this.apiExterna.getDadosTime(
        createPartidaDto.timeCasa,
      );
      if (logo) escudoTimeCasa = logo;
    }
    if (createPartidaDto.rival) {
      const logo = await this.apiExterna.getDadosTime(createPartidaDto.rival);
      if (logo) escudoRival = logo;
    }

    const { colegasNome, data, ...dadosDoJogo } = createPartidaDto;

    return this.prisma.partida.create({
      data: {
        ...dadosDoJogo,
        escudoTimeCasa,
        escudoRival,
        data: new Date(data),
        colegas: {
          connectOrCreate: colegasNome?.map((nome) => ({
            where: { nome },
            create: { nome },
          })),
        },
      },
      include: { colegas: true },
    });
  }

  async findAll() {
    return this.prisma.partida.findMany({
      orderBy: { data: 'desc' },
      include: { colegas: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.partida.findUnique({
      where: { id },
      include: { colegas: true },
    });
  }

  async remove(id: string) {
    return this.prisma.partida.delete({
      where: { id },
    });
  }

  async getEstatisticas() {
    const totalPorResultado = await this.prisma.partida.groupBy({
      by: ['resultado'],
      _count: {
        resultado: true,
      },
    });

    const jogosSozinho = await this.prisma.partida.count({
      where: {
        colegas: {
          none: {},
        },
      },
    });
    const colegasDados = await this.prisma.colega.findMany({
      include: {
        partidas: {
          select: { resultado: true },
        },
      },
      orderBy: {
        partidas: {
          _count: 'desc',
        },
      },
    });

    const aproveitamento = colegasDados.map((colega) => {
      let vitorias = 0;
      let empates = 0;
      let derrotas = 0;
      colega.partidas.forEach((partida) => {
        if (partida.resultado === 'VITORIA') vitorias++;
        else if (partida.resultado === 'EMPATE') empates++;
        else if (partida.resultado === 'DERROTA') derrotas++;
      });

      return {
        nome: colega.nome,
        jogos: colega.partidas.length,
        vitorias,
        empates,
        derrotas,
      };
    });

    return {
      totalJogos: totalPorResultado.reduce(
        (acc, item) => acc + item._count.resultado,
        0,
      ),
      resultados: totalPorResultado.map((item) => ({
        tipo: item.resultado,
        quantidade: item._count.resultado,
      })),
      topColegas: aproveitamento,
      jogosSozinho: jogosSozinho,
    };
  }
}
