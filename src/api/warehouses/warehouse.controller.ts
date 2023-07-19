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
import { WarehouseService } from './warehouse.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('warehouses')
@UseGuards(AuthGuard('jwt'))
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}
  

  @Get()
  async getAll(@Request() req) {
    try {
      let { total, warehouses } = await this.service.get();

      return {
        statusCode: 200,
        status: true,
        message: 'Success',
        data: {
          total,
          warehouses,
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
  async create(@Request() req, @Body() { payload }) {
    try {
      let { warehouse } = await this.service.create(req.user, payload);

      return {
        statusCode: 200,
        status: true,
        message: 'Success',
        data: { warehouse },
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
    @Body() { payload },
  ) {
    try {
      let { warehouse } = await this.service.update(
        req.user,
        warehouseId,
        payload,
      );

      return {
        statusCode: 200,
        status: true,
        message: 'Success',
        data: { warehouse },
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
