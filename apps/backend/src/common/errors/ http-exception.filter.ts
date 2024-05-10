import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../dto/error-response.interface';

@Catch()
export class HttpExceptionFilter<T = unknown> implements ExceptionFilter<T> {
  protected logger = new Logger(HttpExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getExceptionStatus(exception);
    const message = this.getExceptionMessage(exception);
    const errorResponse: ErrorResponse = {
      name: this.getExceptionName(exception),
      statusCode: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      message,
    };

    this.logger.error(errorResponse);
    response.status(status).json(errorResponse);
  }

  getExceptionName(exception: unknown): string {
    const defaultName = 'UnknownException';
    if (exception instanceof Error) {
      return exception.name || defaultName;
    }
    return defaultName;
  }

  getExceptionStatus(exception: unknown): HttpStatus {
    const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      return exception.getStatus() || defaultStatus;
    }
    return defaultStatus;
  }

  getExceptionMessage(exception: unknown): string {
    // Handles arrays thrown by class-validator
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      let message: unknown;
      if (typeof response === 'object' && 'message' in response) {
        message = response.message;
      } else {
        return exception.message;
      }
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      if (typeof message === 'string') {
        return message;
      }
    }

    if (exception instanceof HttpException) {
      return exception.message;
    }
    if (exception && typeof exception === 'object' && 'message' in exception) {
      return exception.message as string;
    }
    return 'Internal Server Error';
  }
}
