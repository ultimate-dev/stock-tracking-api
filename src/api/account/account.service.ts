import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async get(id: number, company_id: number) {
    const where = { id, company_id };

    let user = await this.prisma.user.findFirst({
      where,
      include: { company: true },
    });
    return {
      user,
    };
  }
}
