import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  async get(filters: any, search, sorter) {
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

  async create(user, data) {
    let currency = await this.prisma.currency.create({
      data: {
        company_id: user.company_id,
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

  async update(user, id, data) {
    let where = { id, company_id: user.company_id };
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
}
