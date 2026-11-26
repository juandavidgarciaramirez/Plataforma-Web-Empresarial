/**
 * Error con un mensaje redactado para los registros: nunca incluye correos,
 * teléfonos, credenciales ni otros datos de la petición.
 */
export class SafeLogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/**
 * Resumen de un error apto para los registros. El mensaje de un error de Prisma
 * puede incluir los valores de la consulta (nombres, correos, teléfonos, texto
 * de un chat), así que de los demás errores solo se conservan el tipo, el código
 * y la columna afectada.
 */
export function safeErrorSummary(error: unknown): string {
  if (error instanceof SafeLogError) return error.message;
  if (!(error instanceof Error)) return 'Error desconocido';
  const { code, meta } = error as Error & {
    code?: string;
    meta?: { target?: unknown; field_name?: unknown; column_name?: unknown };
  };
  const field = meta?.target ?? meta?.field_name ?? meta?.column_name;
  return [error.name, code, field ? `(${String(field)})` : ''].filter(Boolean).join(' ');
}
