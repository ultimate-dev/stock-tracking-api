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
import params from 'utils/params';

@Controller('stocks')
@UseGuards(AuthGuard('jwt'))
export class StockController {
  constructor(private readonly service: StockService) {}

  getDate(day) {
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    return date;
  }

  @Get()
  async getAll(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    { search = '', sorter_name = 'stock_cart_id', sorter_dir = 'asc' },
  ) {
    try {
      let { total, stocks } = await this.service.getAll(
        {
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
          status: 'ACTIVE',
          stock_cart: {
            status: 'ACTIVE',
          },
        },
        search,
        { sorter_name, sorter_dir },
      );

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

  @Get('one/:id')
  async get(
    @Request() req,
    @Param('id') id: number,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { stock } = await this.service.get({
        id,
        company_id: req.user.company_id,
        warehouse_id: parseInt(warehouse_id),
      });

      return {
        statusCode: 200,
        status: true,
        data: { stock },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('movements')
  async getMovements(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    {
      search = '',
      sorter_name = 'date',
      sorter_dir = 'desc',
      start_date = this.getDate(-30),
      end_date = this.getDate(1),
      query_name,
      query_id,
      query_value,
    },
  ) {
    try {
      let { total, stockMovements } = await this.service.getMovements(
        {
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
          status: 'ACTIVE',
          date: {
            gte: new Date(start_date),
            lte: new Date(end_date),
          },
          ...params.queryGenerator(query_name, query_value, query_id),
        },
        search,
        { sorter_name, sorter_dir },
      );

      return {
        statusCode: 200,
        status: true,
        data: { total, stockMovements },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('income-and-expense')
  async getIncomeAndExpense(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    {
      search = '',
      sorter_name = 'date',
      sorter_dir = 'desc',
      start_date = this.getDate(-30),
      end_date = this.getDate(1),
      query_name,
      query_id,
      query_value,
    },
  ) {
    try {
      let { total, income_and_expense } =
        await this.service.getIncomeAndExpense(
          {
            company_id: req.user.company_id,
            warehouse_id: parseInt(warehouse_id),
            status: 'ACTIVE',
            date: {
              gte: new Date(start_date),
              lte: new Date(end_date),
            },
            ...params.queryGenerator(query_name, query_value, query_id),
          },
          search,
          { sorter_name, sorter_dir },
        );
      return {
        statusCode: 200,
        status: true,
        data: { total, income_and_expense },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('current-accounts')
  async getCurrentAccounts(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    { search = '', sorter_name = 'stock_cart_id', sorter_dir = 'desc' },
  ) {
    try {
      let { total, currentAccounts } = await this.service.getCurrentAccounts(
        {
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
          status: 'ACTIVE',
        },
        {
          stock_cart: {
            status: 'ACTIVE',
          },
        },
        search,
        { sorter_name, sorter_dir },
      );
      return {
        statusCode: 200,
        status: true,
        data: { total, currentAccounts },
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
      let { stock } = await this.service.create({
        ...body,
        company_id: req.user.company_id,
        warehouse_id: parseInt(warehouse_id),
      });

      return {
        statusCode: 200,
        status: true,
        message: 'Kayıt Oluşturuldu',
        data: { stock },
      };
    } catch (error) {
      console.error(error);
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put('/operations')
  async createOperation(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let data: any[] = body;
      let stocks = [];

      if (data && data.length > 0) {
        await Promise.all(
          data.map(async (item) => {
            let { stock } = await this.service.create({
              ...item,
              company_id: req.user.company_id,
              warehouse_id: parseInt(warehouse_id),
            });
            stocks.push(stock);
          }),
        );
        return {
          statusCode: 200,
          status: true,
          message: 'Kayıt Oluşturuldu',
          data: { stocks },
        };
      } else {
        return {
          statusCode: 200,
          status: false,
          message: 'Eksik bilgi! Eklenecek Stok bulunamadı!',
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

  @Post('/price_update')
  async priceUpdate(
    @Request() req,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      console.log(body)
      let { ids = [], type = 'PERCENT', value1 = 0, value2 = 0 } = body;
      await Promise.all(
        ids.map(async (id) => {
          let { stockCart } = await this.service.getCart(id);

          await this.service.updateCart(id, {
            supply_price:
              stockCart.supply_price +
              (type == 'PERCENT'
                ? (stockCart.supply_price * value1) / 100
                : type == 'UNIT'
                ? value1
                : 0),
            sell_price:
              stockCart.sell_price +
              (type == 'PERCENT'
                ? (stockCart.sell_price * value2) / 100
                : type == 'UNIT'
                ? value2
                : 0),
            company_id: req.user.company_id,
            warehouse_id: parseInt(warehouse_id),
          });
        }),
      );

      return {
        statusCode: 200,
        status: true,
        message: 'Değişiklikler Başarıyla Kaydedildi',
        data: {},
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
      let { stock } = await this.service.update(id, {
        ...body,
        company_id: req.user.company_id,
        warehouse_id: parseInt(warehouse_id),
      });

      return {
        statusCode: 200,
        status: true,
        message: 'Değişiklikler Başarıyla Kaydedildi',
        data: { stock },
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
  async getCarts(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    {
      search = '',
      sorter_name = 'id',
      sorter_dir = 'asc',
      query_name,
      query_id,
      query_value,
    },
  ) {
    try {
      let { total, stockCarts } = await this.service.getCarts(
        {
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
          status: 'ACTIVE',
          ...params.queryGenerator(query_name, query_value, query_id),
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
        warehouse_id: parseInt(warehouse_id),
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
        NOT: { id, warehouse_id: parseInt(warehouse_id) },
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
        stock_category_type: body.stock_category_type,
        warehouse_id: parseInt(warehouse_id),
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
        stock_category_type: body.stock_category_type,
        NOT: { id, warehouse_id: parseInt(warehouse_id) },
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
