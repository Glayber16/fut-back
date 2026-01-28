import { Module } from '@nestjs/common';
import { PartidasModule } from './partidas/partidas.module';
import { PrismaService } from './prisma.service';
import { ApiExternaModule } from './api-externa/api-externa.module';
@Module({
  imports: [PartidasModule, ApiExternaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
