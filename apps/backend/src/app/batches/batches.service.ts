import { Injectable, Logger } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchEntity, Status } from './entities/batch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { SendBatchDto } from './dto/send-batch.dto';
import { CompanyEntity } from '../companies/entities/company.entity';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

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
    let parent = null;

    if (createBatchDto.parentLotNumber) {
      parent = await this.checkParentBatchBelongsToUser(
        createBatchDto.parentLotNumber,
        user
      );
    }

    // TODO: ensure that this error does not crash the app
    this.checkUserHasCompany(user);

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

  async findAll(
    email: string,
    page: number,
    limit: number
  ): Promise<PaginationResponseDto<BatchEntity>> {
    this.logger.log(`Fetching batches for ${email}`);
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });
    const { company } = user;

    // roots - all batches owned by your company
    // and they don't have a parent
    // or the parent is not owned by your company
    const batchRepository = this.dataSource.getRepository(BatchEntity);

    // TODO: if parent is not owned, remove parentLotNumber?
    const [batches, totalCount] = await batchRepository
      .createQueryBuilder('batch')
      .leftJoin(
        'batch_entity',
        'parent',
        'batch.parentLotNumber = parent.lotNumber'
      )
      .where("batch.companyId = :companyId AND batch.status = 'accepted'", {
        companyId: company.id,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('parent.companyId IS NULL').orWhere(
            'parent.companyId != batch.companyId'
          );
        })
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: batches,
      meta: {
        itemCount: batches.length,
        totalItems: totalCount,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  async inbox(
    email: string,
    page: number,
    limit: number
  ): Promise<PaginationResponseDto<BatchEntity>> {
    this.logger.log(`Fetching batches from inbox for ${email}`);
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });
    const { company } = user;

    // roots - all batches owned by your company
    // and they don't have a parent
    // or the parent is not owned by your company
    const batchRepository = this.dataSource.getRepository(BatchEntity);

    // TODO: if parent is not owned, remove parentLotNumber?
    const [batches, totalCount] = await batchRepository
      .createQueryBuilder('batch')
      .leftJoin(
        'batch_entity',
        'parent',
        'batch.parentLotNumber = parent.lotNumber'
      )
      .leftJoinAndSelect(
        'batch.company',
        'company',
        'batch.companyId = company.id'
      )
      .where('batch.companyId = :companyId', {
        companyId: company.id,
      })
      .andWhere("batch.status != 'accepted'")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: batches,
      meta: {
        itemCount: batches.length,
        totalItems: totalCount,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  async send(lotNumber: string, sendBatchDto: SendBatchDto, email: string) {
    this.logger.log(
      `Sending batch ${lotNumber} for user ${email} to company ${sendBatchDto.VAT}`
    );
    // TODO: check that the batch belongs to the current user
    const user = await this.userRepository.findOneOrFail({
      where: { email },
      relations: ['company'],
    });
    const batch = await this.batchRepository.findOne({
      where: { lotNumber },
      relations: ['company'],
    });
    if (batch.company.id !== user.company.id) {
      this.logger.error(`Batch ${lotNumber} does not belong to user ${email}`);
      throw new Error(`Batch ${lotNumber} does not belong to user ${email}`);
    }
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

  async accept(lotNumber: string, _body: unknown, email: string) {
    // TODO: check that the batch belongs to the current user
    const batch = await this.batchRepository.findOne({ where: { lotNumber } });
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

  async decline(lotNumber: string, body: unknown) {
    // TODO: check that the batch belongs to the current user
    const batch = await this.batchRepository.findOne({
      where: { lotNumber },
      relations: ['parent'],
    });
    const parent = await this.batchRepository.findOne({
      where: { lotNumber: batch.parent.lotNumber },
      relations: ['company'],
    });

    const { company } = parent;
    const updatedBatch = await this.batchRepository.save({
      ...batch,
      status: Status.DECLINED,
      company,
      // TODO: revert to the vat of the parent batch
    });
    return updatedBatch;
  }

  async reclaim(lotNumber: string, body: unknown) {
    this.logger.log(`Reclaiming batch ${lotNumber}`);
    // TODO: check that the batch belongs to the current user
    const batch = await this.batchRepository.findOne({ where: { lotNumber } });
    const updatedBatch = await this.batchRepository.save({
      ...batch,
      status: Status.ACCEPTED,
    });
    return updatedBatch;
  }

  findOne(lotNumber: string) {
    // attach all children 1 level deep
    return this.batchRepository
      .createQueryBuilder('batch')
      .where('batch.lotNumber = :lotNumber', { lotNumber })
      .leftJoinAndSelect('batch.subBatches', 'subBatches')
      .leftJoinAndSelect('subBatches.company', 'company')
      .getOne();
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

  async checkParentBatchBelongsToUser(
    parentLotNumber: string,
    user: UserEntity
  ) {
    const parentBatch = await this.batchRepository.findOne({
      where: { lotNumber: parentLotNumber },
      relations: ['company'],
    });

    const { company, email } = user;
    const { id: userCompanyId } = company;

    if (parentBatch && parentBatch.company.id !== userCompanyId) {
      this.logger.error(
        `Parent batch ${parentLotNumber} does not belong to user ${email}`
      );
      throw new Error(
        `Parent batch ${parentLotNumber} does not belong to user ${email}`
      );
    }

    return parentBatch;
  }

  async checkUserHasCompany(user) {
    if (!user.company) {
      this.logger.error(`User with email ${user.email} has no company`);
      throw new Error(`User with email ${user.email} has no company`);
    }
  }
}
