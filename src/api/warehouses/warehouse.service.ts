import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const where = {};

    let total = await this.prisma.warehouse.count({ where });
    let warehouses = await this.prisma.warehouse.findMany({ where });
    return {
      total,
      warehouses,
    };
  }

  async create(user, data) {
    let warehouse = await this.prisma.warehouse.create({
      data: {
        status: data.status,
        company_id: user.company_id,
        code: data.code,
        name: data.name,
        responsible_person_name: data.responsible_person_name,
        phone: data.phone,
        address: data.address,
        description: data.description,
        main: data.main,
      },
    });
    return {
      warehouse,
    };
  }

  async update(user, id, data) {
    let where = { id, company_id: user.company_id };
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
        main: data.main,
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
