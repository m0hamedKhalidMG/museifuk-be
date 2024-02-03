import { IsEmail, IsEnum, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Role } from '../entities/user.entity'; 
import { Exclude, Expose } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @IsEnum(Role)
  role: Role;

  Common_diseases: boolean;


  @IsOptional()
  @IsString()
  @Expose() // Expose this property when transforming to plain object
  nationalId?: string;

  
  @Exclude({ toPlainOnly: true })
  passwordHash: string;
}
