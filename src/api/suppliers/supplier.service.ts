import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [{ code: { contains: search } }, { name: { contains: search } }],
    };
    const orderBy: any = { [sorter.sorter_name]: sorter.sorter_dir };

    let total = await this.prisma.supplier.count({ where });
    let suppliers = await this.prisma.supplier.findMany({ where, orderBy });
    return {
      total,
      suppliers,
    };
  }

  async get(filters: any) {
    const where: any = {
      ...filters,
    };
    let supplier = await this.prisma.supplier.findFirst({
      where,
    });
    return {
      supplier,
    };
  }

  async create(data) {
    let supplier = await this.prisma.supplier.create({
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
      supplier,
    };
  }

  async update(id, data) {
    let where = { id, company_id: data.company_id };
    await this.prisma.supplier.updateMany({
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
    let supplier = await this.prisma.supplier.findFirst({
      where,
    });
    return {
      supplier,
    };
  }
}
