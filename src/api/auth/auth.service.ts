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
}
