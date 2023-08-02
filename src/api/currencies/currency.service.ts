import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [{ symbol: { contains: search } }, { name: { contains: search } }],
    };
    const orderBy: any = { [sorter.sorter_name]: sorter.sorter_dir };

    let total = await this.prisma.currency.count({ where });
    let currencies = await this.prisma.currency.findMany({ where, orderBy });
    return {
      total,
      currencies,
    };
  }

  async get(filters: any) {
    const where: any = {
      ...filters,
    };
    let currency = await this.prisma.currency.findFirst({
      where,
    });
    return {
      currency,
    };
  }

  async create(data) {
    let currency = await this.prisma.currency.create({
      data: {
        company_id: data.company_id,
        warehouse_id: data.warehouse_id,
        status: data.status,
        symbol: data.symbol,
        name: data.name,
        value: data.value,
      },
    });
    return {
      currency,
    };
  }

  async update(id, data) {
    let where = { id, company_id: data.company_id };
    await this.prisma.currency.updateMany({
      where,
      data: {
        status: data.status,
        symbol: data.symbol,
        name: data.name,
        value: data.value,
      },
    });
    let currency = await this.prisma.currency.findFirst({
      where,
    });
    return {
      currency,
    };
  }

  async delete(id, filters) {
    let where = { id, ...filters };
    let deleted = await this.prisma.currency.updateMany({
      where,
      data: { status: 'DELETED' },
    });
    return deleted;
  }

  async symbolControl(symbol: string, filters = {}) {
    let count = await this.prisma.currency.count({
      where: { symbol, ...filters },
    });
    if (count <= 0) return true;
    return false;
  }
}
