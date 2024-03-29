/* eslint-disable max-lines */
import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { decorate, Mixin } from 'ts-mixer';

import { ErrorResponse } from './error-response.interface';

const statusCodeDescription = 'The error status code';
const messageDescription = 'The error message';
const detailsDescription = 'The error details';

export class ErrorResponseDto extends ErrorResponse {
  @decorate(
    ApiProperty({
      example: 'ErrorName',
    })
  )
  name: string;

  @decorate(
    ApiProperty({
      description: statusCodeDescription,
      example: HttpStatus.BAD_REQUEST,
    })
  )
  statusCode: number;

  @decorate(
    ApiPropertyOptional({
      example: 'POST',
    })
  )
  method?: string;

  @decorate(
    ApiProperty({
      description: 'The path on which the error was generated',
      example: 'auth/login',
    })
  )
  path: string;

  @decorate(
    ApiProperty({
      description: 'The date on which the error was generated',
      example: '2021-10-05T14:48:00.000Z',
    })
  )
  timestamp: string;

  @decorate(
    ApiProperty({
      description: messageDescription,
      example: 'Error message',
      type: 'string',
    })
  )
  message: string;

  @decorate(
    ApiPropertyOptional({
      description: detailsDescription,
      oneOf: [
        { type: 'string' },
        { type: 'object' },
        {
          type: 'array',
          items: {
            oneOf: [{ type: 'string' }, { type: 'object' }],
          },
        },
      ],
      required: false,
      example: 'Error details',
    })
  )
  details?: any;
}

export class BadRequestErrorResponseDto extends Mixin(ErrorResponseDto) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.BAD_REQUEST,
    default: HttpStatus.BAD_REQUEST,
  })
  statusCode: number;
}

export class UnauthorizedErrorResponseDto extends Mixin(ErrorResponseDto) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.UNAUTHORIZED,
    default: HttpStatus.UNAUTHORIZED,
  })
  statusCode: number;
}

export class ForbiddenErrorResponseDto extends Mixin(ErrorResponseDto) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.FORBIDDEN,
    default: HttpStatus.FORBIDDEN,
  })
  statusCode: number;
}

export class NotFoundErrorResponseDto extends Mixin(ErrorResponseDto) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.NOT_FOUND,
    default: HttpStatus.NOT_FOUND,
  })
  statusCode: number;
}

export class NotAcceptableErrorResponseDto extends Mixin(ErrorResponseDto) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.NOT_ACCEPTABLE,
    default: HttpStatus.NOT_ACCEPTABLE,
  })
  statusCode: number;
}

export class ConflictErrorResponseDto extends Mixin(ErrorResponseDto) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.CONFLICT,
    default: HttpStatus.CONFLICT,
  })
  statusCode: number;
}

export class TooManyRequestsErrorResponseDto extends Mixin(ErrorResponseDto) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.TOO_MANY_REQUESTS,
    default: HttpStatus.TOO_MANY_REQUESTS,
  })
  statusCode: number;
}

export class ServiceUnavailableErrorResponseDto extends Mixin(
  ErrorResponseDto
) {
  @ApiProperty({
    description: statusCodeDescription,
    example: HttpStatus.SERVICE_UNAVAILABLE,
    default: HttpStatus.SERVICE_UNAVAILABLE,
  })
  statusCode: number;
}
