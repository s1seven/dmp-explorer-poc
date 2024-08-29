import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Auth0Service } from '../auth0/auth0.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly auth0Service: Auth0Service
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    this.logger.log(`Creating user ${email}`);

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const baseUser = this.userRepository.create({
      ...createUserDto,
    });
    await this.userRepository.save(baseUser);
    this.logger.log(`Created user ${baseUser.email}`);
  }

  async getUsers() {
    return this.auth0Service.getUsers();
  }

  async findOne(email: string): Promise<UserEntity> {
    const foundUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!foundUser) {
      throw new NotFoundException(`User ${email} not found`);
    }
    return foundUser;
  }
}
