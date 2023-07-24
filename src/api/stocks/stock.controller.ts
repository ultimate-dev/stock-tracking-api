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
} from '@nestjs/common';
import { StockService } from './stock.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stocks')
@UseGuards(AuthGuard('jwt'))
export class StockController {
  constructor(private readonly service: StockService) {}

  // Carts
  @Get('carts')
  async getCarts(@Request() req, @Headers('warehouse_id') warehouse_id) {
    try {
      let { total, stockCarts } = await this.service.getCarts({
        warehouse_id: parseInt(warehouse_id),
      });

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

  @Post('carts/:stockCartId')
  async updateCart(
    @Request() req,
    @Param('stockCartId') stockCartId: number,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCart } = await this.service.updateCart(
        req.user,
        stockCartId,
        body,
      );

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
  async getCategories(@Request() req, @Headers('warehouse_id') warehouse_id) {
    try {
      let { total, stockCategories } = await this.service.getCategories({
        warehouse_id: parseInt(warehouse_id),
      });

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

  @Post('categories/:stockCategoryId')
  async updateCategory(
    @Request() req,
    @Param('stockCategoryId') stockCategoryId: number,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCategory } = await this.service.updateCategory(
        req.user,
        stockCategoryId,
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
