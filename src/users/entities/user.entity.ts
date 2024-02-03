import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @IsString()
  @Exclude({ toPlainOnly: true })
  passwordHash: string;

  @Column({ nullable: false, type: 'enum', enum: Role })
  @IsEnum(Role)
  role: Role;

  @Column({ nullable: false, default: false })
  Common_diseases: boolean;

  @Column({ nullable: false,unique: true })
  @IsString()
  nationalId: string;
}
