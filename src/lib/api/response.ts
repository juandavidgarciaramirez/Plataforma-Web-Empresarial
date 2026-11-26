/**
 * Envelope estándar de respuesta de la API (sección 24 del brief).
 *
 * Todas las rutas bajo `src/app/api/v1/**` deben responder con una de estas
 * dos formas, para que el frontend tenga un único contrato que consumir.
 */

export interface ApiSuccessBody<T = unknown> {
  success: true
  message: string
  data: T
}

export interface ApiErrorBody {
  success: false
  message: string
  errors: string[]
}

export function apiSuccess<T>(data: T, message = "Operación realizada correctamente"): ApiSuccessBody<T> {
  return { success: true, message, data }
}

export function apiError(message: string, errors: string[] = []): ApiErrorBody {
  return { success: false, message, errors }
}
