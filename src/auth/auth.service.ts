import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UserWithoutPasswordHash } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'libs/crypto/src';



export class LoginData {
    @ApiProperty()
    accessToken: string;
  
    @ApiProperty()
    user: UserWithoutPasswordHash;
  }
  
@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly cryptoService: CryptoService,

      ) {}
      async validateUserWithCredentials(
        email: string,
        password: string,
      ): Promise<UserWithoutPasswordHash | null> {
        try {
          const user = await this.usersService.findOneByEmail(email);
          const isPasswordCorrect = await this.cryptoService.compare(
            password,
            user.passwordHash,
          );

          if (isPasswordCorrect) {
            const { passwordHash, ...result } = user;

            return result;
          }
        } catch (error) {}
    
        return null;
      }
    
      async validateUserWithPayload(
        payload: any,
      ): Promise<UserWithoutPasswordHash | null> {
        try {
          const { passwordHash, ...user } = await this.usersService.findOne(
            payload.sub,
          );
    
          return user;
        } catch (error) {}
    
        return null;
      }
      login(user: any): LoginData {
        const payload = {
          sub: user.id,
          email: user.email,
          role: user.role,
          nationalId:user.nationalId
        };
console.log(payload)

try {
    const accessToken = this.jwtService.sign(payload);
  } catch (error) {
    console.error('Error signing JWT:', error.message);
    throw new Error('Failed to sign JWT');
  }


        return {
          accessToken: this.jwtService.sign(payload),
          user: { ...user },
        };
      }
}
