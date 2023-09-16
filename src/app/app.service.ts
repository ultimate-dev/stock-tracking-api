import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  hello() {
    return { data: 'Helloworld' };
  }

  version() {
    return { data: process.env.CLIENT_VERSION };
  }
}
