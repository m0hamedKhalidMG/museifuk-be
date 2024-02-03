import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { UserWithoutPasswordHash } from 'src/users/users.controller';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secert key'
    });
  }

  async validate(payload: any): Promise<UserWithoutPasswordHash | null> {
    return this.authService.validateUserWithPayload(payload);
  }
}
