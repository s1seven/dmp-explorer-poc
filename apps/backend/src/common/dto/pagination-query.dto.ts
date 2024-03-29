import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional()
  limit: number;

  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional()
  offset: number;
}
