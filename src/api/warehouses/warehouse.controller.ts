import { Controller, Get } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Get()
  async getAll() {
    let { total, warehouses } = await this.service.getAll();

    return { total, warehouses };
  }
}
