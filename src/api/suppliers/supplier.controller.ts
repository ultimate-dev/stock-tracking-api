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
  Headers,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupplierService } from './supplier.service';
import { Transform } from 'class-transformer';

@Controller('suppliers')
@UseGuards(AuthGuard('jwt'))
export class SupplierController {
  constructor(private readonly service: SupplierService) {}

  @Get()
  async getAll(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    { search = '', sorter_name = 'id', sorter_dir = 'asc' },
  ) {
    try {
      let { total, suppliers } = await this.service.get(
        {
          warehouse_id: parseInt(warehouse_id),
        },
        search,
        {
          sorter_name,
          sorter_dir,
        },
      );

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
  async create(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
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
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
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
