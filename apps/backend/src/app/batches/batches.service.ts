import { Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchEntity } from './entities/batch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

const MAX_LEAD_CONTENT = 0.1;
const MAX_MERCURY_CONTENT = 0.1;
const MAX_CADMIUM_CONTENT = 0.01;

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(BatchEntity)
    private readonly batchRepository: Repository<BatchEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(createBatchDto: CreateBatchDto, email: string) {
    const isRoHSCompliant =
      createBatchDto.leadContent <= MAX_LEAD_CONTENT &&
      createBatchDto.mercuryContent <= MAX_MERCURY_CONTENT &&
      createBatchDto.cadmiumContent <= MAX_CADMIUM_CONTENT;
    const user = await this.userRepository.findOne({ where: { email } });

    const newBatch = this.batchRepository.create({
      ...createBatchDto,
      isRoHSCompliant,
      owner: user,
    });
    return this.batchRepository.save(newBatch);
  }

  findAll(email: string) {
    return this.batchRepository.find({ where: { owner: { email } } });
  }

  findOne(id: number) {
    return `This action returns a #${id} batch`;
  }

  update(id: number, updateBatchDto: UpdateBatchDto) {
    return `This action updates a #${id} batch`;
  }

  remove(id: number) {
    return `This action removes a #${id} batch`;
  }
}
