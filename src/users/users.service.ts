import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CryptoService } from '@app/crypto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly cryptoService: CryptoService,

  ) {}

  async create(
    createUserDto: CreateUserDto,
    queryRunner?: QueryRunner,
  ): Promise<User> {
    // Email should be unique
    const isEmailUsed = await this.isEmailUsed(createUserDto.email);
    if (isEmailUsed) {
      throw new BadRequestException('Email is already exists');
    }

    const passwordHash = await this.cryptoService.hash(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash,
    });
    return queryRunner
      ? queryRunner.manager.save(user)
      : this.usersRepository.save(user);
  }


 

  async findAll(): Promise<User[]> {

    return this.usersRepository.find();
  }
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }
  async findOneByEmail(email: string): Promise<User> {
    let user;
    try {
      user = await this.usersRepository.findOneBy({ email });
    } catch (err) {
      console.log(err);
    }

    if (!user) {
      throw new NotFoundException(`User with email #[${email}] not found`);
    }
    return user;
  }

 
  
 

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Email should be unique
    if (updateUserDto.email) {
      const isEmailUsed = await this.isEmailUsed(updateUserDto.email, id);
      if (isEmailUsed) {
        throw new BadRequestException('Email is already exists');
      }
    }

    // Get user
    const user = await this.findOne(id);

    // Change password, if permitted
    let passwordHash = user.passwordHash;
    if (updateUserDto.currentPassword && updateUserDto.newPassword) {
      const isPasswordCorrect = await this.cryptoService.compare(
        updateUserDto.currentPassword,
        user.passwordHash,
      );

      if (!isPasswordCorrect) {
        throw new ForbiddenException('The current password is not correct');
      }

      passwordHash = await this.cryptoService.hash(updateUserDto.newPassword);
    }

    // Update
    const updatedUser = await this.usersRepository.preload({
      ...user,
      ...updateUserDto,
      passwordHash,
    });

    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return user;
    
  }

  private async isEmailUsed(email: string, id?: number): Promise<boolean> {
    const user = await this.usersRepository.findBy({
      email,
    });

    if (user.length === 0) {
      return false;
    }

    if (id && user.length === 1) {
      return user[0].id !== id;
    }

    return true;
  }
}
