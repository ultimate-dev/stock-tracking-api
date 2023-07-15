import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  async getAll() {
    let { total, stocks } = await this.service.getAll();

    return { total, stocks };
  }
}
