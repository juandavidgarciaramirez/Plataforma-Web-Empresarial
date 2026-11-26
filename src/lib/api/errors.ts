/**
 * Errores tipados que la capa de servicio lanza y que los controllers
 * traducen al envelope estándar (`apiError`) con el status HTTP correcto.
 */

export class ValidationError extends Error {
  errors: string[]

  constructor(errors: string[], message = "Error de validación") {
    super(message)
    this.name = "ValidationError"
    this.errors = errors
  }
}

export class NotFoundError extends Error {
  constructor(message = "Recurso no encontrado") {
    super(message)
    this.name = "NotFoundError"
  }
}
