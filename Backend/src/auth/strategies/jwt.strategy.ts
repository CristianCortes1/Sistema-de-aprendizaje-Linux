import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'kahskldjhjkefrjkew78483753478dhyu8fyew895784yf867485y8dyu8f', // Debe coincidir con el secret del auth.module.ts
    });
  }

  async validate(payload: any) {
    return { id_Usuario: payload.sub, username: payload.username, rol: payload.rol };
  }
}
