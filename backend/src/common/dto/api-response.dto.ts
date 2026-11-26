/**
 * Envelope estándar de respuesta de la API — el mismo contrato que ya usa
 * el resto del proyecto en `src/lib/api/response.ts` (frontend), para que
 * ambos lados hablen el mismo formato:
 *
 *   { success: true,  message, data }
 *   { success: false, message, errors }
 */
export interface ApiSuccessBody<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors: string[];
}

export function apiSuccess<T>(data: T, message = 'Operación realizada correctamente'): ApiSuccessBody<T> {
  return { success: true, message, data };
}

export function apiError(message: string, errors: string[] = []): ApiErrorBody {
  return { success: false, message, errors };
}
