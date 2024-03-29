import { plainToInstance, Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(65535)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  PORT?: number = null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  DATABASE_PORT?: number;

  @IsString()
  @MinLength(10)
  DATABASE_URL: string;

  // @IsString()
  // @MinLength(10)
  // JWT_SECRET: string;
}

export function validate(
  configuration: Record<string, unknown>
): EnvironmentVariables {
  const finalConfig = plainToInstance(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return finalConfig;
}
