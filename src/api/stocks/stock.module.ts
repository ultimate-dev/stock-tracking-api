import { Module } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [],
  controllers: [StockController],
  providers: [StockService, PrismaService],
})
export class StockModule {}
