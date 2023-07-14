import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'db/prisma.service';

@Module({
  imports: [
    PassportModule,
    //-- Api
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
