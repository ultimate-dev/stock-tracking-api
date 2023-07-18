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
        message: 'Success',
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
  async create(@Request() req, @Body() { payload }) {
    try {
      let { supplier } = await this.service.create(req.user, payload);

      return {
        statusCode: 200,
        status: true,
        message: 'Success',
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

  @Post(':supplierId')
  async update(
    @Request() req,
    @Param('supplierId') supplierId: number,
    @Body() { payload },
  ) {
    try {
      let { supplier } = await this.service.update(
        req.user,
        supplierId,
        payload,
      );

      return {
        statusCode: 200,
        status: true,
        message: 'Success',
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
