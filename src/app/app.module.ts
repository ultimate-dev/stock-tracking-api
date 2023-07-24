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
import { CustomerModule } from 'api/customers/customer.module';
import { CurrencyModule } from 'api/currencies/currency.module';
import { AdminModule } from 'api/admin/admin.module';

@Module({
  imports: [
    PassportModule,
    //-- Api
    AuthModule,
    AccountModule,
    SupplierModule,
    WarehouseModule,
    StockModule,
    CustomerModule,
    CurrencyModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
