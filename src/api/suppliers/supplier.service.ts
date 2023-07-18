import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async get(fields?: any) {
    const where = { ...fields };

    let total = await this.prisma.supplier.count(where);
    let suppliers = await this.prisma.supplier.findMany(where);
    return {
      total,
      suppliers,
    };
  }

  async create(user, payload) {
    let supplier = await this.prisma.supplier.create({
      data: {
        status: payload.status,
        company_id: user.company_id,
        code: payload.code,
        name: payload.name,
        phone: payload.phone,
        description: payload.description,
      },
    });
    return {
      supplier,
    };
  }

  async update(user, supplierId, payload) {
    let where = { id: supplierId, company_id: user.company_id };
    await this.prisma.supplier.updateMany({
      where,
      data: {
        status: payload.status,
        code: payload.code,
        name: payload.name,
        phone: payload.phone,
        description: payload.description,
      },
    });
    let supplier = await this.prisma.supplier.findFirst({
      where,
    });
    return {
      supplier,
    };
  }
}
