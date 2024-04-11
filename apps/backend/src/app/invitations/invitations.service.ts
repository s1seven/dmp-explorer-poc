import { Injectable } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Repository } from 'typeorm';
import { InvitationEntity } from './entities/invitation.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(InvitationEntity)
    private invitationRespository: Repository<InvitationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}
  async create(createInvitationDto: CreateInvitationDto, email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });
    if (!user.company) {
      throw new Error('You must be part of a company to create an invitation');
    }
    const { company } = user;
    if (company.VAT !== createInvitationDto.VAT) {
      throw new Error(
        'You can only create invitations for companies that you are part of'
      );
    }
    const createdInvitation = this.invitationRespository.create({
      ...createInvitationDto,
      company,
    });
    return this.invitationRespository.save(
      createdInvitation
    );
  }

  findAll() {
    return `This action returns all invitations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invitation`;
  }

  update(id: number, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} invitation`;
  }
}
