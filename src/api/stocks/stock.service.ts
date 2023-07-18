import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}
}
