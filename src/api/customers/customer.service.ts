import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [{ code: { contains: search } }, { name: { contains: search } }],
    };
    const orderBy: any = { [sorter.sorter_name]: sorter.sorter_dir };

    let total = await this.prisma.customer.count({ where });
    let customers = await this.prisma.customer.findMany({ where, orderBy });
    return {
      total,
      customers,
    };
  }

  async get(filters: any) {
    const where: any = {
      ...filters,
    };
    let customer = await this.prisma.customer.findFirst({
      where,
    });
    let price = 0;
    let stocks = await this.prisma.stock.findMany({
      where: {
        status: 'ACTIVE',
        customer_id: customer.id,
        stock_type: 'SELL',
        payment_status: false,
      },
    });

    await Promise.all(
      stocks.map((stock) => (price += Math.abs(stock.quantity) * stock.price)),
    );
    return {
      customer: { ...customer, price },
    };
  }

  async create(data) {
    let customer = await this.prisma.customer.create({
      data: {
        company_id: data.company_id,
        warehouse_id: data.warehouse_id,
        status: data.status,
        code: data.code,
        name: data.name,
        phone: data.phone,
        address: data.address,
        description: data.description,
      },
    });
    return {
      customer,
    };
  }

  async update(id, data) {
    let where = { id, company_id: data.company_id };
    await this.prisma.customer.updateMany({
      where,
      data: {
        status: data.status,
        code: data.code,
        name: data.name,
        phone: data.phone,
        address: data.address,
        description: data.description,
      },
    });
    let customer = await this.prisma.customer.findFirst({
      where,
    });
    return {
      customer,
    };
  }
  async delete(id, filters) {
    let where = { id, ...filters };
    let deleted = await this.prisma.customer.updateMany({
      where,
      data: { status: 'DELETED' },
    });
    return deleted;
  }

  async codeControl(code: string, filters = {}) {
    let count = await this.prisma.customer.count({
      where: { code, ...filters },
    });
    if (count <= 0) return true;
    return false;
  }
}
