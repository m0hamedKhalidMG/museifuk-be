import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { Role, User } from './entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/auth/decorators/public.decorator';

export class UserWithoutPasswordHash extends OmitType(User, ['passwordHash']) {}


 @ApiBearerAuth('JWT-auth')
 @ApiUnauthorizedResponse({ description: 'Unauthenticated.' })
 @ApiForbiddenResponse({ description: 'Forbidden.' })
 @ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiCreatedResponse({
    type: UserWithoutPasswordHash,
  })
  @ApiBadRequestResponse({ description: 'Malformed.' })
  
  
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto)
    return this.usersService.create(createUserDto);
  }
  @ApiResponse({
    status: 200,
    type: [UserWithoutPasswordHash],
  })
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
  return this.usersService.findAll();
  }
  @Roles(Role.ADMIN)

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Roles(Role.ADMIN)

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Roles(Role.ADMIN)

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}

