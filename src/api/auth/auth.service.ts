import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
}
