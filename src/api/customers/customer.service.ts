import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async get(filters: any) {
    const where = { ...filters };

    let total = await this.prisma.customer.count({ where });
    let customers = await this.prisma.customer.findMany({ where });
    return {
      total,
      customers,
    };
  }

  async create(user, data) {
    let customer = await this.prisma.customer.create({
      data: {
        company_id: user.company_id,
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

  async update(user, id, data) {
    let where = { id, company_id: user.company_id };
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
