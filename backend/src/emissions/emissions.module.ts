import { Module } from '@nestjs/common';
import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmissionsController],
  providers: [EmissionsService],
  exports: [EmissionsService],
})
export class EmissionsModule {} 