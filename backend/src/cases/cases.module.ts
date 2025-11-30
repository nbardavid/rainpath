import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CasesController } from './cases.controller';
import { CasesRepository } from './cases.repository';
import { CasesService } from './cases.service';

@Module({
  imports: [PrismaModule],
  controllers: [CasesController],
  providers: [CasesService, CasesRepository],
})
export class CasesModule {}
