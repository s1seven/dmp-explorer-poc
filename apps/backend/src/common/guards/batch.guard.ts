import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { BatchEntity } from '../../app/batches/entities/batch.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../app/users/entities/user.entity';
import { AuthenticatedRequest } from '../constants/constants';

@Injectable()
export class BatchOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(BatchEntity)
    private readonly batchRepository: Repository<BatchEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { email } = request.user;
    const lotNumber = request.params.id;

    return this.validateOwnership(email, lotNumber);
  }

  async validateOwnership(email: string, lotNumber: string): Promise<boolean> {
    if (!email || !lotNumber) {
      return false;
    }

    const batch = await this.batchRepository
      .createQueryBuilder('batch')
      .innerJoin('batch.company', 'company')
      .innerJoin('company.users', 'user', 'user.email = :email', { email })
      .where('batch.lotNumber = :lotNumber', { lotNumber })
      .select('batch.lotNumber')
      .getOne();

    return !!batch;
  }
}
