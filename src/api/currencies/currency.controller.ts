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
import { CurrencyService } from './currency.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('currencies')
@UseGuards(AuthGuard('jwt'))
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get()
  async getAll(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    { search = '', sorter_name = 'id', sorter_dir = 'asc' },
  ) {
    try {
      let { total, currencies } = await this.service.get(
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

        data: {
          total,
          currencies,
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
  async create(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { currency } = await this.service.create(req.user, body);

      return {
        statusCode: 200,
        status: true,

        data: { currency },
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
      let { currency } = await this.service.update(req.user, id, body);

      return {
        statusCode: 200,
        status: true,

        data: { currency },
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
