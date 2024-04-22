import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty()
  emailToInvite: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;
}
