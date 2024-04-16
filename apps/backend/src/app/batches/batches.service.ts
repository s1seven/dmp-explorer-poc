import { Injectable, Logger } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchEntity, Status } from './entities/batch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, getTreeRepository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { SendBatchDto } from './dto/send-batch.dto';
import { CompanyEntity } from '../companies/entities/company.entity';

const MAX_LEAD_CONTENT = 0.1;
const MAX_MERCURY_CONTENT = 0.1;
const MAX_CADMIUM_CONTENT = 0.01;

@Injectable()
export class BatchesService {
  private readonly logger = new Logger(BatchesService.name);

  constructor(
    @InjectRepository(BatchEntity)
    private readonly batchRepository: Repository<BatchEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private dataSource: DataSource
  ) {}

  async create(createBatchDto: CreateBatchDto, email: string) {
    // TODO: verify that the quantity of all sub-batches is equal to or less than the parent batch
    this.logger.log(
      `Creating batch:  ${createBatchDto.lotNumber} for user ${email}`
    );
    const isRoHSCompliant = this.isRoHSCompliant(createBatchDto);
    const user = await this.checkUserExists(email);
    await this.checkBatchDoesNotExist(createBatchDto.lotNumber);
    await this.checkParentBatchBelongsToUser(
      createBatchDto.parentLotNumber,
      user.id
    );
    // TODO: ensure that this error does not crash the app
    this.checkUserHasCompany(user);

    let parent = null;
    if (createBatchDto.parentLotNumber) {
      parent = await this.batchRepository.findOne({
        where: { lotNumber: createBatchDto.parentLotNumber },
      });
    }
    // TODO: inherit isRoHSCompliant from parent batch
    const newBatch = this.batchRepository.create({
      ...createBatchDto,
      isRoHSCompliant,
      parent,
      company: user.company,
    });
    this.logger.log(`Creating batch: `, JSON.stringify(newBatch));
    return this.batchRepository.save(newBatch);
  }

  private isRoHSCompliant(batch: CreateBatchDto) {
    return (
      batch.leadContent <= MAX_LEAD_CONTENT &&
      batch.mercuryContent <= MAX_MERCURY_CONTENT &&
      batch.cadmiumContent <= MAX_CADMIUM_CONTENT
    );
  }

  async findAll(email: string) {
    this.logger.log(`Fetching batches for ${email}`);
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });
    const { company } = user;
    const batchRepository = this.dataSource.getTreeRepository(BatchEntity);

    const roots = await batchRepository.find({
      where: { company: { id: company.id } },
    });
    const treePromises = roots.map((root) =>
      batchRepository.findDescendantsTree(root, { depth: 1 })
    );

    return Promise.all(treePromises);
  }

  async send(id: string, sendBatchDto: SendBatchDto) {
    // TODO: check that the batch belongs to the current user
    const batch = await this.batchRepository.findOne({ where: { id } });
    // check that the vat is not the current company?
    // TODO: add better error handling
    const company = await this.companyRepository.findOneOrFail({
      where: { VAT: sendBatchDto.VAT },
    });
    const newBatch = await this.batchRepository.save({
      ...batch,
      company,
      status: Status.PENDING,
    });
    return newBatch;
  }

  async accept(id: string, _body: unknown, email: string) {
    // TODO: check that the batch belongs to the current user
    const batch = await this.batchRepository.findOne({ where: { id } });
    // if (!batch.parentLotNumber) {
    //   this.logger.error(`Batch ${id} has no parent`);
    //   throw new Error(`You can only send sub-batches`);
    // }
    const updatedBatch = await this.batchRepository.save({
      ...batch,
      status: Status.ACCEPTED,
    });
    return updatedBatch;
  }

  async decline(id: string, body: unknown) {
    // TODO: check that the batch belongs to the current user
    const batch = await this.batchRepository.findOne({ where: { id } });
    const updatedBatch = await this.batchRepository.save({
      ...batch,
      status: Status.DECLINED,
      // TODO: revert to the vat of the parent batch
    });
    return updatedBatch;
  }

  async reclaim(id: string, body: unknown) {
    // TODO: check that the batch belongs to the current user
    const batch = await this.batchRepository.findOne({ where: { id } });
    const updatedBatch = await this.batchRepository.save({
      ...batch,
      status: Status.ACCEPTED,
    });
    return updatedBatch;
  }

  findOne(id: string) {
    return this.batchRepository.findOne({
      where: { id },
      relations: ['subBatches'],
    });
  }

  update(id: string, updateBatchDto: UpdateBatchDto) {
    return `This action updates a #${id} batch`;
  }

  remove(id: string) {
    return `This action removes a #${id} batch`;
  }

  async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });

    if (!user) {
      this.logger.error(`User with email ${email} not found`);
      throw new Error(`User with email ${email} not found`);
    }

    return user;
  }

  async checkBatchDoesNotExist(lotNumber: string) {
    const existingBatch = await this.batchRepository.findOne({
      where: { lotNumber },
    });

    if (existingBatch) {
      this.logger.error(`Batch with lot number ${lotNumber} already exists`);
      throw new Error(`Batch with lot number ${lotNumber} already exists`);
    }
  }

  async checkParentBatchBelongsToUser(parentLotNumber: string, userId: string) {
    const parentBatch = await this.batchRepository.findOne({
      where: { lotNumber: parentLotNumber },
    });

    if (parentBatch && parentBatch.company.id !== userId) {
      this.logger.error(
        `Parent batch ${parentLotNumber} does not belong to user ${userId}`
      );
      throw new Error(
        `Parent batch ${parentLotNumber} does not belong to user ${userId}`
      );
    }
  }

  async checkUserHasCompany(user) {
    if (!user.company) {
      this.logger.error(`User with email ${user.email} has no company`);
      throw new Error(`User with email ${user.email} has no company`);
    }
  }
}
