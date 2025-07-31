import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { VesselsModule } from './vessels/vessels.module';
import { EmissionsModule } from './emissions/emissions.module';
import { DeviationsModule } from './deviations/deviations.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    PrismaModule,
    VesselsModule,
    EmissionsModule,
    DeviationsModule,
    SeedModule,
  ],
})
export class AppModule {} 