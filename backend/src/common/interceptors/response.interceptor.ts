import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessBody, apiSuccess } from '../dto/api-response.dto';

/**
 * Envuelve toda respuesta 2xx en el envelope estándar `{ success, message, data }`.
 * Un controller puede devolver `{ message: '...' , data: ... }` para
 * personalizar el mensaje; cualquier otro valor se usa tal cual como `data`.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessBody<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccessBody<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result && typeof result === 'object' && 'message' in result && 'data' in result) {
          const { message, data } = result as { message: string; data: T };
          return apiSuccess<T>(data, message);
        }

        return apiSuccess<T>(result as T);
      }),
    );
  }
}
