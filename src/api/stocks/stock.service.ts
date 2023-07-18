import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async get(fields?: any) {
    const where = { ...fields };

    let total = await this.prisma.stock.count(where);
    let stocks = await this.prisma.stock.findMany(where);
    return {
      total,
      stocks,
    };
  }
}
