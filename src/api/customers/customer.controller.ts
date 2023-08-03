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
import { CustomerService } from './customer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  async getAll(
    @Request() req,
    @Headers('warehouse_id') warehouse_id,
    @Query()
    { search = '', sorter_name = 'id', sorter_dir = 'asc' },
  ) {
    try {
      let { total, customers } = await this.service.getAll(
        {
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
          status: 'ACTIVE',
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
          customers,
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

  @Get(':id')
  async get(
    @Request() req,
    @Param('id') id: number,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let { customer } = await this.service.get({
        id,
        company_id: req.user.company_id,
        warehouse_id: parseInt(warehouse_id),
      });

      return {
        statusCode: 200,
        status: true,
        data: { customer },
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
      let code_control = await this.service.codeControl(body.code, {
        status: 'ACTIVE',
        warehouse_id: parseInt(warehouse_id)
      });
      if (code_control) {
        let { customer } = await this.service.create({
          ...body,
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
        });

        return {
          statusCode: 200,
          status: true,
          message: 'Kayıt Oluşturuldu',
          data: { customer },
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

  @Post(':id')
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() body,
    @Headers('warehouse_id') warehouse_id,
  ) {
    try {
      let code_control = await this.service.codeControl(body.code, {
        status: 'ACTIVE',
        NOT: { id, warehouse_id: parseInt(warehouse_id), },
      });
      if (code_control) {
        let { customer } = await this.service.update(id, {
          ...body,
          company_id: req.user.company_id,
          warehouse_id: parseInt(warehouse_id),
        });

        return {
          statusCode: 200,
          status: true,
          message: 'Değişiklikler Başarıyla Kaydedildi',
          data: { customer },
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

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: number) {
    try {
      await this.service.delete(id, {
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
