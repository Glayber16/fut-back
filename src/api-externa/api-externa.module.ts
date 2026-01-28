import { Module } from '@nestjs/common';
import { ApiExternaService } from './api-externa.service';

@Module({
  providers: [ApiExternaService],
  exports: [ApiExternaService],
})
export class ApiExternaModule {}
