import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VesselsService } from './vessels.service';

@Controller('vessels')
export class VesselsController {
  constructor(private readonly vesselsService: VesselsService) {}

  @Get()
  findAll() {
    return this.vesselsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vesselsService.findOne(id);
  }
} 