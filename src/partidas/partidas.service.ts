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
    let dadosApi = {};
    let diaJogo = createPartidaDto.data;
    if (createPartidaDto.timeCasa && createPartidaDto.data) {
      const result = await this.apiExterna.getDadosTime(
        createPartidaDto.timeCasa,
        createPartidaDto.data.toString(),
      );
      if (result) {
        dadosApi = {
          escudoTimeCasa: result.escudoTimeCasa,
          escudoRival: result.escudoRival,
        };
        diaJogo = result.data;
      }
    }

    const { colegasNome, data, ...dadosDoJogo } = createPartidaDto;

    return this.prisma.partida.create({
      data: {
        ...dadosDoJogo,
        ...dadosApi,
        data: new Date(diaJogo),
        colegas: {
          connectOrCreate: colegasNome?.map((nome) => ({
            where: { nome: nome },
            create: { nome: nome },
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
}
