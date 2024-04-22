import { IsNotEmpty, IsString } from 'class-validator';

export class SendBatchDto {
  @IsString()
  @IsNotEmpty()
  VAT: string;
}
