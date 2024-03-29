import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsInt } from "class-validator";

import { BaseUserDto } from "./base-user.dto";

export class ReturnUserDto extends BaseUserDto {
  @Exclude()
  password: string;

  @IsInt()
  @ApiProperty()
  id: number;
}

