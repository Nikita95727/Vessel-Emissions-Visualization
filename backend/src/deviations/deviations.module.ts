import { Module } from '@nestjs/common';
import { DeviationsController } from './deviations.controller';
import { DeviationsService } from './deviations.service';
import { VesselsModule } from '../vessels/vessels.module';
import { EmissionsModule } from '../emissions/emissions.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [VesselsModule, EmissionsModule, PrismaModule],
  controllers: [DeviationsController],
  providers: [DeviationsService],
  exports: [DeviationsService],
})
export class DeviationsModule {} 