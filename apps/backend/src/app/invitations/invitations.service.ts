import { Injectable, Logger } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Repository } from 'typeorm';
import { InvitationEntity } from './entities/invitation.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

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
    return this.invitationRespository.save(createdInvitation);
  }

  async acceptInvitation(
    id: string,
    acceptInvitationDto: AcceptInvitationDto,
    email: string
  ) {
    const { accepted } = acceptInvitationDto;
    const foundInvitation = await this.invitationRespository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (foundInvitation.emailToInvite !== email) {
      throw new Error('You are not allowed to accept this invitation');
    }
    if (!foundInvitation) {
      throw new Error('Invitation not found');
    }
    const { company } = foundInvitation;
    if (accepted) {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      // TODO: handle case where multiple companies are present
      const updatedUser = await this.userRepository.save({
        ...user,
        company,
      });
      // eslint-disable-next-line no-console
      console.log('updatedUser', updatedUser);
    }

    return this.invitationRespository.delete(id);
  }

  findAll(email: string) {
    return this.invitationRespository.find({
      where: { emailToInvite: email },
    });
  }

  async findOne(id: string, email: string) {
    this.logger.log(`Getting all invitations for ${email}`);
    const foundInvitation = await this.invitationRespository.findOne({
      where: { id },
    });
    if (foundInvitation.emailToInvite !== email) {
      throw new Error('You are not allowed to see this invitation');
    }
    return [foundInvitation];
  }

  update(id: number, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} invitation`;
  }
}
