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
import { CurrencyService } from './currency.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('currencies')
@UseGuards(AuthGuard('jwt'))
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get()
  async getAll(@Request() req) {
    try {
      let { total, currencies } = await this.service.get();

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
  async create(@Request() req, @Body() body) {
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
  async update(@Request() req, @Param('id') id: number, @Body() body) {
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
