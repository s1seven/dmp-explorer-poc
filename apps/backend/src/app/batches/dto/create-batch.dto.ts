import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Unit } from '../../../common/constants/constants';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lotNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  parentLotNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  parentId: string;

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

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsEnum(Unit)
  @IsNotEmpty()
  @ApiProperty()
  unit: Unit;
}
