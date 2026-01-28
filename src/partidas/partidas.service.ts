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
  let escudoTimeCasa = "";
  let escudoRival = "";
  if (createPartidaDto.timeCasa) {
    const logo = await this.apiExterna.getDadosTime(createPartidaDto.timeCasa);
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
    const colegasMaisPresentes = await this.prisma.colega.findMany({
      include: {
        _count: {
          select: { partidas: true }, 
        },
      },
      orderBy: {
        partidas: {
          _count: 'desc', 
        },
      },
      });
    return {
      totalJogos: totalPorResultado.reduce((acc, item) => acc + item._count.resultado, 0),
      resultados: totalPorResultado.map((item) => ({
        tipo: item.resultado,
        quantidade: item._count.resultado,
      })),
      topColegas: colegasMaisPresentes.map((c) => ({
        nome: c.nome,
        jogos: c._count.partidas,
      })), 
    };
  }
}
