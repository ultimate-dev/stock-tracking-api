import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const where = {};

    let total = await this.prisma.warehouse.count(where);
    let warehouses = await this.prisma.warehouse.findMany(where);
    return {
      total,
      warehouses,
    };
  }
}
