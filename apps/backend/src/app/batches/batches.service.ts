import { Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const MAX_LEAD_CONTENT = 0.1;
const MAX_MERCURY_CONTENT = 0.1;
const MAX_CADMIUM_CONTENT = 0.01;

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch) private readonly batchRepository: Repository<Batch>
  ) {}
  create(createBatchDto: CreateBatchDto) {
    const isRoHSCompliant =
      createBatchDto.leadContent <= MAX_LEAD_CONTENT &&
      createBatchDto.mercuryContent <= MAX_MERCURY_CONTENT &&
      createBatchDto.cadmiumContent <= MAX_CADMIUM_CONTENT;

    const newBatch = this.batchRepository.create({
      ...createBatchDto,
      isRoHSCompliant,
      // owner: { id: 1 },
    });
    return this.batchRepository.save(newBatch);
  }

  findAll() {
    // TODO: filter by owner
    return this.batchRepository.find();
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
