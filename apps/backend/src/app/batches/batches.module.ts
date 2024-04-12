import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchEntity } from './entities/batch.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CompanyEntity } from '../companies/entities/company.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([BatchEntity, UserEntity, CompanyEntity]),
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
