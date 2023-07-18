import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'api/auth/auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtGuard extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExipration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(decoded: any): Promise<any> {
    let user = await this.authService.user({ id: decoded.id });
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
