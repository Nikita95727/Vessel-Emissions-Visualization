import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EmissionsService } from './emissions.service';

@Controller('emissions')
export class EmissionsController {
  constructor(private readonly emissionsService: EmissionsService) {}

  @Get('vessel/:vesselId')
  findByVessel(
    @Param('vesselId', ParseIntPipe) vesselId: number,
    @Query('limit') limit?: string,
  ) {
    return this.emissionsService.findByVessel(vesselId, limit ? parseInt(limit) : undefined);
  }

  @Get('vessel/:vesselId/quarter-end/:year')
  findQuarterEndEmissions(
    @Param('vesselId', ParseIntPipe) vesselId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.emissionsService.findQuarterEndEmissions(vesselId, year);
  }
} 