import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, LoginData } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
interface AuthenticatedRequest extends Request {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    type: LoginData,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiBody({
    required: true,
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  
@Public()
@UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: AuthenticatedRequest) {
    return this.authService.login(req.user as User );
  }
}
