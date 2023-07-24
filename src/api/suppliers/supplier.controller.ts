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
import { AuthGuard } from '@nestjs/passport';
import { SupplierService } from './supplier.service';

@Controller('suppliers')
@UseGuards(AuthGuard('jwt'))
export class SupplierController {
  constructor(private readonly service: SupplierService) {}

  @Get()
  async getAll(@Request() req) {
    try {
      let { total, suppliers } = await this.service.get();

      return {
        statusCode: 200,
        status: true,

        data: { total, suppliers },
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
      let { supplier } = await this.service.create(req.user, body);

      return {
        statusCode: 200,
        status: true,

        data: { supplier },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post(':id')
  async update(@Request() req, @Param('id') id: number, @Body() body) {
    try {
      let { supplier } = await this.service.update(req.user, id, body);

      return {
        statusCode: 200,
        status: true,

        data: { supplier },
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
