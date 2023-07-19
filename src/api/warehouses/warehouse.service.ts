import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async get(fields?: any) {
    const where = { ...fields };

    let total = await this.prisma.warehouse.count({ where });
    let warehouses = await this.prisma.warehouse.findMany({ where });
    return {
      total,
      warehouses,
    };
  }

  async create(user, payload) {
    let warehouse = await this.prisma.warehouse.create({
      data: {
        status: payload.status,
        company_id: user.company_id,
        code: payload.code,
        name: payload.name,
        responsible_person_name: payload.responsible_person_name,
        phone: payload.phone,
        address: payload.address,
        description: payload.description,
      },
    });
    return {
      warehouse,
    };
  }

  async update(user, warehouseId, payload) {
    let where = { id: warehouseId, company_id: user.company_id };
    await this.prisma.warehouse.updateMany({
      where,
      data: {
        status: payload.status,
        code: payload.code,
        name: payload.name,
        responsible_person_name: payload.responsible_person_name,
        phone: payload.phone,
        address: payload.address,
        description: payload.description,
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
