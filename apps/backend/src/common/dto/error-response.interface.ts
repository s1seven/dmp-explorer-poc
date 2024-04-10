import { Expose, Transform } from 'class-transformer';
import {
  IsAlpha,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Environment } from '../constants/constants';

export class ErrorResponse extends Error {
  constructor(
    message: string,
    statusCode?: number,
    name?: string,
    details?: any
  ) {
    super(message);
    this.name = name || this.constructor.name;
    this.message = message;
    this.statusCode = statusCode || 500;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  @Expose()
  @IsAlpha()
  name!: string;

  @Expose()
  @IsNumber()
  statusCode!: number;

  @Expose()
  @IsString()
  path!: string;

  @Expose()
  @IsOptional()
  @IsString()
  method?: string;

  @Expose()
  @IsDateString()
  timestamp!: string;

  @Expose()
  @IsString()
  message!: string;

  @Expose()
  // Do not show stack trace in production
  @Transform(({ value }) =>
    process.env.NODE_ENV === Environment.Production ? null : value
  )
  @IsOptional()
  @IsString()
  stack?: string;

  // all other complex messages
  @Expose()
  @IsOptional()
  details?: any;
}
