import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: any, search, sorter) {
    const where: any = {
      ...filters,
      OR: [{ code: { contains: search } }, { name: { contains: search } }],
    };
    const orderBy: any = { [sorter.sorter_name]: sorter.sorter_dir };

    let total = await this.prisma.warehouse.count({ where });
    let warehouses = await this.prisma.warehouse.findMany({
      where,
      orderBy,
    });
    return {
      total,
      warehouses,
    };
  }

  async get(filters: any) {
    const where: any = {
      ...filters,
    };
    let warehouse = await this.prisma.warehouse.findFirst({
      where,
    });
    return {
      warehouse,
    };
  }

  async create(data) {
    let warehouse = await this.prisma.warehouse.create({
      data: {
        company_id: data.company_id,
        status: data.status,
        code: data.code,
        name: data.name,
        responsible_person_name: data.responsible_person_name,
        phone: data.phone,
        address: data.address,
        description: data.description,
      },
    });
    return {
      warehouse,
    };
  }

  async update(id, data) {
    let where = { id, company_id: data.company_id };
    await this.prisma.warehouse.updateMany({
      where,
      data: {
        status: data.status,
        code: data.code,
        name: data.name,
        responsible_person_name: data.responsible_person_name,
        phone: data.phone,
        address: data.address,
        description: data.description,
      },
    });
    let warehouse = await this.prisma.warehouse.findFirst({
      where,
    });
    return {
      warehouse,
    };
  }
}
