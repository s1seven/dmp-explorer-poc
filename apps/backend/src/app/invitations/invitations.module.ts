import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entities/invitation.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([InvitationEntity, UserEntity]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
