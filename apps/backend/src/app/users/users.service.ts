import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ReqUser } from '../constants/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const createdOn = new Date();
    const newUser = this.userRepository.create({
      ...createUserDto,
      createdOn,
      updatedOn: createdOn,
      password,
    });
    await this.userRepository.save(newUser);
    // automatically log-in user
    // return this.authService.signIn({ email, password });
  }

  async findOneById(id: number, user: ReqUser): Promise<ReturnUserDto> {
    const { sub: currentUserId } = user;
    if (id !== +currentUserId) {
      throw new UnauthorizedException();
    }
    const foundUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!foundUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return plainToInstance(ReturnUserDto, foundUser);
  }

  async findOne(email: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!foundUser) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return foundUser;
  }

  async remove(id: number, user: ReqUser): Promise<ReturnUserDto> {
    const { sub: currentUserId } = user;
    if (id !== +currentUserId) {
      throw new UnauthorizedException();
    }
    const foundUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!foundUser) {
      throw new NotFoundException(`Prefil data #${id} not found`);
    }
    const removedUser = this.userRepository.remove(foundUser);
    return plainToInstance(ReturnUserDto, removedUser);
  }
}
