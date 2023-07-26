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
import { StockService } from './stock.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stocks')
@UseGuards(AuthGuard('jwt'))
export class StockController {
  constructor(private readonly service: StockService) {}

  // Carts
  @Get('carts')
  async getCarts(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    { search = '', sorter_name = 'id', sorter_dir = 'asc' },
  ) {
    try {
      let { total, stockCarts } = await this.service.getCarts(
        {
          warehouse_id: parseInt(warehouse_id),
        },
        search,
        { sorter_name, sorter_dir },
      );

      return {
        statusCode: 200,
        status: true,

        data: { total, stockCarts },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put('carts')
  async createCart(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCart } = await this.service.createCart(req.user, body);

      return {
        statusCode: 200,
        status: true,

        data: { stockCart },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('carts/:id')
  async updateCart(
    @Request() req,
    @Param('id') id: number,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCart } = await this.service.updateCart(req.user, id, body);

      return {
        statusCode: 200,
        status: true,

        data: { stockCart },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // Categories
  @Get('categories')
  async getCategories(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    { type, search = '', sorter_name = 'id', sorter_dir = 'asc' },
  ) {
    try {
      let { total, stockCategories } = await this.service.getCategories(
        {
          stock_category_type: type,
          warehouse_id: parseInt(warehouse_id),
        },
        search,
        { sorter_name, sorter_dir },
      );

      return {
        statusCode: 200,
        status: true,

        data: { total, stockCategories },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put('categories')
  async createCategory(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCategory } = await this.service.createCategory(req.user, body);

      return {
        statusCode: 200,
        status: true,

        data: { stockCategory },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('categories/:id')
  async updateCategory(
    @Request() req,
    @Param('id') id: number,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCategory } = await this.service.updateCategory(
        req.user,
        id,
        body,
      );

      return {
        statusCode: 200,
        status: true,

        data: { stockCategory },
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
