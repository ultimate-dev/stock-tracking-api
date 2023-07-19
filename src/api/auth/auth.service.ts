import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async user(fields: any) {
    let where: any = { ...fields };
    let user = await this.prisma.user.findFirst({
      where,
    });
    return { user };
  }

  async getWarehouses(fields?: any) {
    const where = { ...fields };
    const select = { id: true, code: true, name: true };

    let total = await this.prisma.warehouse.count({ where });
    let warehouses = await this.prisma.warehouse.findMany({ where, select });
    return {
      total,
      warehouses,
    };
  }
}
