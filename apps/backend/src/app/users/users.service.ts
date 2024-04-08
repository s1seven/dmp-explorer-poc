import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import { ReqUser } from '../constants/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { User } from './entities/user.entity';
import { Auth0Service } from '../auth0/auth0.service';
import { runInTransaction } from '../../common/helpers/transaction';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectDataSource() private readonly connection: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly auth0Service: Auth0Service
  ) {}

  private getTransactionManager(): <T>(
    action: (qr: QueryRunner) => Promise<T>
  ) => Promise<T> {
    return <T>(action: (qr: QueryRunner) => Promise<T>) =>
      runInTransaction(action, this.connection, this.logger);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    let baseUser = this.userRepository.create({
      ...createUserDto,
    });
    let auth0UserId: string;

    try {
      const transactionRunner = this.getTransactionManager();
      return await transactionRunner(async (qr) => {
        baseUser = await qr.manager.save(baseUser);
        auth0UserId = await this.auth0Service.createUser({ email, password });
        this.logger.verbose(`Created user ${baseUser.email}`);
      });
    } catch (e) {
      this.logger.verbose(
        `Failed to create user ${baseUser.email}, reverting changes...`
      );
      // If auth0UserId is assigned, the user was created in Auth0 before the error occurred, so we need to delete it
      if (auth0UserId) {
        await this.auth0Service.deleteUser(auth0UserId);
      }
    }
  }

  async getUsers() {
    return this.auth0Service.getUsers();
  }

  async findOneById(id: string, user: ReqUser): Promise<ReturnUserDto> {
    const { sub: currentUserId } = user;
    if (id !== currentUserId) {
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
      throw new NotFoundException(`User ${email} not found`);
    }
    return foundUser;
  }

  async remove(id: string, user: ReqUser): Promise<ReturnUserDto> {
    const { sub: currentUserId } = user;
    if (id !== currentUserId) {
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
