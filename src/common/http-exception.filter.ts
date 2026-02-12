import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface NestErrorResponse {
  message: string | string[];
  error?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Pastikan status dipaksa menjadi tipe Enum HttpStatus
    const status: HttpStatus = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let errors: string | string[] | null;

    if (this.isNestErrorResponse(exceptionResponse)) {
      if (
        status === HttpStatus.BAD_REQUEST &&
        Array.isArray(exceptionResponse.message)
      ) {
        message = 'Validation Error';
        errors = exceptionResponse.message;
      } else {
        message = exceptionResponse.error ?? 'Error';
        errors = exceptionResponse.message;
      }
    } else {
      message = 'Error';
      errors = typeof exceptionResponse === 'string' ? exceptionResponse : null;
    }

    response.status(status).json({
      message,
      errors,
    });
  }

  private isNestErrorResponse(res: unknown): res is NestErrorResponse {
    return typeof res === 'object' && res !== null && 'message' in res;
  }
}
