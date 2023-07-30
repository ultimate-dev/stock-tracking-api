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
    return {
      customer,
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
}
