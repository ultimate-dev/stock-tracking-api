import { Module } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from 'guards/jwt.guard';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, JwtGuard],
})
export class AuthModule {}
