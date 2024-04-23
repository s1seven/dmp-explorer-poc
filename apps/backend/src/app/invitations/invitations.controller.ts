import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReqUser } from '../../common/constants/constants';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Controller('invitations')
@UseGuards(AuthorizationGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  create(
    @Body() createInvitationDto: CreateInvitationDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    // TODO: handle duplicate key error
    return this.invitationsService.create(createInvitationDto, email);
  }

  @Post(':id')
  acceptInvitation(
    @Param('id') id: string,
    @Body() acceptInvitationDto: AcceptInvitationDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.invitationsService.acceptInvitation(
      id,
      acceptInvitationDto,
      email
    );
  }

  @Get()
  findAll(
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.invitationsService.findAll(email);
  }

  @Get('/all')
  findAllInvitationsByCompany(
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.invitationsService.findAllInvitationsByCompany(email);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.invitationsService.findOne(id, email);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvitationDto: UpdateInvitationDto
  ) {
    return this.invitationsService.update(+id, updateInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationsService.remove(+id);
  }
}
