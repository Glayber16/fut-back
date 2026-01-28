import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';

@Controller('partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Post()
  create(@Body() createPartidaDto: CreatePartidaDto) {
    return this.partidasService.create(createPartidaDto);
  }

  @Get()
  findAll() {
    return this.partidasService.findAll();
  }
  @Get('estatisticas')
  getStats() {
    return this.partidasService.getEstatisticas();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partidasService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partidasService.remove(id);
  }
}
