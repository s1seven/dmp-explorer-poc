import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  VAT: string;

  @IsString()
  @IsOptional()
  name?: string;
}
