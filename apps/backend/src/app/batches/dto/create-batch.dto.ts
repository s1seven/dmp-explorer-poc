import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lotNumber: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  leadContent: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  mercuryContent: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  cadmiumContent: number;
}
