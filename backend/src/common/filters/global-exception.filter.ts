import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { apiError } from '../dto/api-response.dto';

/**
 * Único punto de traducción de cualquier excepción (HttpException de Nest,
 * errores de validation pipe, o errores no controlados) al envelope
 * estándar `{ success: false, message, errors }`. Nunca deja escapar un
 * stack trace ni detalles internos al cliente.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const payload = body as { message?: string | string[]; error?: string };

        if (Array.isArray(payload.message)) {
          // class-validator: cada string es un error de campo individual
          message = 'Error de validación';
          errors = payload.message;
        } else {
          message = payload.message ?? payload.error ?? message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl} → ${status} — ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      // No exponer detalles internos en 5xx
      message = 'Error interno del servidor';
      errors = [];
    } else {
      this.logger.warn(`${request.method} ${request.originalUrl} → ${status} — ${message}`);
    }

    response.status(status).json(apiError(message, errors));
  }
}
