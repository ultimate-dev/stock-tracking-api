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
  Delete,
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
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
          status: 'ACTIVE',
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

  @Get('carts/:id')
  async getCart(
    @Request() req,
    @Param('id') id: number,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCart } = await this.service.getCart({
        id,
        company_id: req.user.company_id,
        warehouse_id: parseInt(warehouse_id),
      });

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

  @Put('carts')
  async createCart(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let code_control = await this.service.codeControlCart(body.code, {
        status: 'ACTIVE',
      });
      if (code_control) {
        let { stockCart } = await this.service.createCart({
          ...body,
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
        });

        return {
          statusCode: 200,
          status: true,
          message: 'Kayıt Oluşturuldu',
          data: { stockCart },
        };
      } else {
        return {
          statusCode: 200,
          status: false,
          message: 'Bu kod zaten tanımlı!',
        };
      }
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
      let code_control = await this.service.codeControlCart(body.code, {
        status: 'ACTIVE',
        NOT: { id },
      });
      if (code_control) {
        let { stockCart } = await this.service.updateCart(id, {
          ...body,
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
        });

        return {
          statusCode: 200,
          status: true,
          message: 'Değişiklikler Başarıyla Kaydedildi',
          data: { stockCart },
        };
      } else {
        return {
          statusCode: 200,
          status: false,
          message: 'Bu kod zaten tanımlı!',
        };
      }
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Delete('carts/:id')
  async deleteCart(@Request() req, @Param('id') id: number) {
    try {
      await this.service.deleteCart(id, {
        company_id: req.user.company_id,
      });
      return {
        statusCode: 200,
        status: true,
        message: 'Kayıt Kaldırıldı.',
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
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
          status: 'ACTIVE',
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

  @Get('categories/:id')
  async getCategory(
    @Request() req,
    @Param('id') id: number,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stockCategory } = await this.service.getCategory({
        id,
        company_id: req.user.company_id,
        warehouse_id: parseInt(warehouse_id),
      });

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

  @Put('categories')
  async createCategory(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let code_control = await this.service.codeControlCategory(body.code, {
        status: 'ACTIVE',
      });
      if (code_control) {
        let { stockCategory } = await this.service.createCategory({
          ...body,
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
        });

        return {
          statusCode: 200,
          status: true,
          message: 'Kayıt Oluşturuldu',
          data: { stockCategory },
        };
      } else {
        return {
          statusCode: 200,
          status: false,
          message:
            'Bu kod zaten tanımlı!',
        };
      }
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
      let code_control = await this.service.codeControlCategory(body.code, {
        status: 'ACTIVE',
        NOT: { id },
      });
      if (code_control) {
        let { stockCategory } = await this.service.updateCategory(id, {
          ...body,
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
        });

        return {
          statusCode: 200,
          status: true,
          message: 'Değişiklikler Başarıyla Kaydedildi',
          data: { stockCategory },
        };
      } else {
        return {
          statusCode: 200,
          status: false,
          message:
            'Bu kod zaten tanımlı!',
        };
      }
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  @Delete('categories/:id')
  async deleteCategory(@Request() req, @Param('id') id: number) {
    try {
      await this.service.deleteCategory(id, {
        company_id: req.user.company_id,
      });
      return {
        statusCode: 200,
        status: true,
        message: 'Kayıt Kaldırıldı.',
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
