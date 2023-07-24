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
import { StockService } from './stock.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stocks')
@UseGuards(AuthGuard('jwt'))
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  async getAll(@Request() req) {
    try {
      let { total, stocks } = await this.service.get();

      return {
        statusCode: 200,
        status: true,

        data: { total, stocks },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // Carts
  @Get('carts')
  async getCarts(@Request() req) {
    try {
      let { total, stockCarts } = await this.service.getCarts();

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
  async createCart(@Request() req, @Body() body) {
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
  async getCategories(@Request() req) {
    try {
      let { total, stockCategories } = await this.service.getCategories();

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
  async createCategory(@Request() req, @Body() body) {
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
