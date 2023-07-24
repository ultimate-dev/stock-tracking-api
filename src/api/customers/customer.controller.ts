import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  async getAll(@Request() req) {
    try {
      let { total, customers } = await this.service.get();

      return {
        statusCode: 200,
        status: true,
        
        data: {
          total,
          customers,
        },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put()
  async create(@Request() req, @Body() body) {
    try {
      let { customer } = await this.service.create(req.user, body);

      return {
        statusCode: 200,
        status: true,
        
        data: { customer },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post(':warehouseId')
  async update(
    @Request() req,
    @Param('warehouseId') warehouseId: number,
    @Body() body,
  ) {
    try {
      let { customer } = await this.service.update(
        req.user,
        warehouseId,
        body,
      );

      return {
        statusCode: 200,
        status: true,
        
        data: { customer },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
