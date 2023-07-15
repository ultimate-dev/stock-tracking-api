import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'db/prisma.service';
// App
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Api
import { SupplierModule } from 'api/suppliers/supplier.module';
import { WarehouseModule } from 'api/warehouses/warehouse.module';
import { StockModule } from 'api/stocks/stock.module';
import { AccountModule } from 'api/account/account.module';
import { AuthModule } from 'api/auth/auth.module';

@Module({
  imports: [
    PassportModule,
    //-- Api
    AuthModule,
    AccountModule,
    SupplierModule,
    WarehouseModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
