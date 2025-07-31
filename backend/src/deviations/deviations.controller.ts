import { Controller, Get, Param, ParseIntPipe, Query, Post } from '@nestjs/common';
import { DeviationsService } from './deviations.service';

@Controller('deviations')
export class DeviationsController {
  constructor(private readonly deviationsService: DeviationsService) {}

  @Get()
  getAllDeviations(@Query('year') year?: string) {
    return this.deviationsService.getAllDeviations(year ? parseInt(year) : undefined);
  }

  @Get('vessel/:vesselId')
  getVesselDeviations(
    @Param('vesselId', ParseIntPipe) vesselId: number,
    @Query('year') year?: string,
  ) {
    return this.deviationsService.getVesselDeviations(vesselId, year ? parseInt(year) : undefined);
  }

  @Post('vessel/:vesselId/calculate/:year')
  calculateVesselDeviations(
    @Param('vesselId', ParseIntPipe) vesselId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.deviationsService.calculateVesselDeviations(vesselId, year);
  }
} 