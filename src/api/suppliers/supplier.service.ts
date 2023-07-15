import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const where = {};

    let total = await this.prisma.supplier.count(where);
    let suppliers = await this.prisma.supplier.findMany(where);
    return {
      total,
      suppliers,
    };
  }
}
