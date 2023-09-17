import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.hello();
  }

  @Post()
  postHello() {
    return this.appService.hello();
  }

  @Put()
  putHello() {
    return this.appService.hello();
  }

  @Delete()
  deleteHello() {
    return this.appService.hello();
  }
}
