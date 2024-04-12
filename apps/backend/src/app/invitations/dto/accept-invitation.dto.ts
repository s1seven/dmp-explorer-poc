import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AcceptInvitationDto {
  @IsBoolean()
  @IsNotEmpty()
  accepted: boolean;
}
