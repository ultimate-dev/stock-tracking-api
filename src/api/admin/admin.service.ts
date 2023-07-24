import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
}
