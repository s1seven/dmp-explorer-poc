import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseTokenUserDto } from './base-token-user.dto';

export class TokenUserDto extends BaseTokenUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly accessToken: string;
}
