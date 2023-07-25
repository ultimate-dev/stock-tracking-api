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
  Query,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('warehouses')
@UseGuards(AuthGuard('jwt'))
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Get()
  async getAll(
    @Request() req,
    @Query()
    { search = '', sorter_name = 'id', sorter_dir = 'asc' },
  ) {
    try {
      let { total, warehouses } = await this.service.get(search, {
        sorter_name,
        sorter_dir,
      });

      return {
        statusCode: 200,
        status: true,

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
  async create(@Request() req, @Body() body) {
    try {
      let { warehouse } = await this.service.create(req.user, body);

      return {
        statusCode: 200,
        status: true,

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

  @Post(':id')
  async update(@Request() req, @Param('id') id: number, @Body() body) {
    try {
      let { warehouse } = await this.service.update(req.user, id, body);

      return {
        statusCode: 200,
        status: true,

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
