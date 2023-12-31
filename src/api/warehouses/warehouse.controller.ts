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
  Delete,
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
      let { total, warehouses } = await this.service.getAll(
        {
          company_id: req.user.company_id,
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

  @Get(':id')
  async get(@Request() req, @Param('id') id: number) {
    try {
      let { warehouse } = await this.service.get({
        id,
        company_id: req.user.company_id,
      });

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

  @Put()
  async create(@Request() req, @Body() body) {
    try {
      let control = await this.service.maxCountControl(req.user.company_id);
      if (control) {
        let code_control = await this.service.codeControl(body.code, {
          status: 'ACTIVE',
        });
        if (code_control) {
          let { warehouse } = await this.service.create({
            ...body,
            company_id: req.user.company_id,
          });

          return {
            statusCode: 200,
            status: true,
            message: 'Kayıt Oluşturuldu',
            data: { warehouse },
          };
        } else {
          return {
            statusCode: 200,
            status: false,
            message: 'Bu kod zaten tanımlı!',
          };
        }
      } else {
        return {
          statusCode: 200,
          status: false,
          message: 'Depo Hakkınız Dolmuştur!',
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
  async update(@Request() req, @Param('id') id: number, @Body() body) {
    try {
      let code_control = await this.service.codeControl(body.code, {
        status: 'ACTIVE',
        NOT: { id },
      });
      if (code_control) {
        let { warehouse } = await this.service.update(id, {
          ...body,
          company_id: req.user.company_id,
        });

        return {
          statusCode: 200,
          status: true,
          message: 'Değişiklikler Başarıyla Kaydedildi',
          data: { warehouse },
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
