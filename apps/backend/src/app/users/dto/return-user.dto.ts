import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

import { BaseUserDto } from './base-user.dto';

export class ReturnUserDto extends BaseUserDto {
  @IsInt()
  @ApiProperty()
  id: number;
}
