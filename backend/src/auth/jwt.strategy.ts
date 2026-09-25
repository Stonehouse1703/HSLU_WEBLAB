import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET, TokenPayload } from './auth.utils.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: any): TokenPayload {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Ungültiges Token.');
    }
    return {
      id: payload.id,
      email: payload.email ?? '',
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
    };
  }
}
