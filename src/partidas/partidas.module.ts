import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidasController } from './partidas.controller';
import { PrismaService } from '../prisma.service';
import { ApiExternaModule } from 'src/api-externa/api-externa.module';

@Module({
  imports: [ApiExternaModule],
  controllers: [PartidasController],
  providers: [PartidasService, PrismaService],
})
export class PartidasModule {}
