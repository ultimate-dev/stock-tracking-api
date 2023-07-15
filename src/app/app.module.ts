import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'db/prisma.service';
// App
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Api

@Module({
  imports: [
    PassportModule,
    //-- Api
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
