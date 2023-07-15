import { Controller, Get } from '@nestjs/common';
import { SupplierService } from './supplier.service';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly service: SupplierService) {}

  @Get()
  async getAll() {
    let { total, suppliers } = await this.service.getAll();

    return { total, suppliers };
  }
}
