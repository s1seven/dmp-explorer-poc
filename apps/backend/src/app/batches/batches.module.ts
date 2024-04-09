import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchEntity } from './entities/batch.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchEntity, UserEntity])],
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
