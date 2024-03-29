import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserWithoutPasswordHash } from 'src/users/users.controller';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<UserWithoutPasswordHash | null> {
    const user = await this.authService.validateUserWithCredentials(
      email,
      password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
