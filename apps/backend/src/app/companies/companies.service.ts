import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(
    createCompanyDto: CreateCompanyDto,
    email: string
  ): Promise<CompanyEntity> {
    this.logger.log(
      `Creating company:  ${createCompanyDto.VAT} for user ${email}`
    );
    this.companyRepository.create(createCompanyDto);
    const createdCompany = await this.companyRepository.save(createCompanyDto);

    // adds the new company to the user that created it
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        `User with email ${email} not found when creating company ${createCompanyDto.VAT}`
      );
    }

    await this.userRepository.save({
      ...user,
      company: createdCompany,
    });

    // TODO: return list of users on the company?
    return createdCompany;
  }

  async findAll(email: string): Promise<CompanyEntity[]> {
    this.logger.log(`Getting all companies for ${email}`);
    const foundUser = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });
    if (!foundUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (!foundUser?.company) {
      return [];
    }
    return this.companyRepository.find({
      where: { id: foundUser.company.id },
    });
  }

  async findOne(email: string, id: string) {
    // const foundUser = await this.userRepository.findOne({ where: { email }, relations: ['company']});
    // if (!foundUser.company) {
    //   throw new NotFoundException('Company not found');
    // }
    // const company = await this.companyRepository.findOne({ where: { id: foundUser.company.id } });
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
