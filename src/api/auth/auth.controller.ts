import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      let { user } = await this.service.user({
        username: body.username,
        status: 'ACTIVE',
      });
      if (user) {
        let control = await bcrypt.compare(body.password, user.password);
        if (control) {
          let token = this.jwtService.sign(
            { id: user.id },
            {
              secret: process.env.JWT_SECRET,
              expiresIn: '1d',
            },
          );
          return {
            statusCode: 200,
            status: true,
            message: 'Success',
            data: {
              token,
            },
          };
        }
      }

      return {
        statusCode: 200,
        status: false,
        message: 'Kullanıcı Bulunamadı!',
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
