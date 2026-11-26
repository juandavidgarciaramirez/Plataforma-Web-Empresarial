/**
 * Validación de archivos adjuntos, reutilizada por PQR (adjuntos) y Careers
 * (hojas de vida). Corre siempre en el servidor: el frontend valida también
 * para dar feedback inmediato, pero nunca es la única línea de defensa
 * (sección 25 del brief).
 */

export interface FileValidationRule {
  /** Extensiones permitidas, en minúscula y sin punto, p. ej. ["pdf", "doc"]. */
  allowedExtensions: string[]
  /** MIME types permitidos. */
  allowedMimeTypes: string[]
  /** Tamaño máximo en bytes. */
  maxSizeBytes: number
}

export const PQR_ATTACHMENT_RULE: FileValidationRule = {
  allowedExtensions: ["pdf", "jpg", "jpeg", "png"],
  allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
  maxSizeBytes: 5 * 1024 * 1024,
}

export const RESUME_RULE: FileValidationRule = {
  allowedExtensions: ["pdf", "doc", "docx"],
  allowedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxSizeBytes: 5 * 1024 * 1024,
}

function getExtension(fileName: string): string {
  const parts = fileName.split(".")
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ""
}

export function validateUploadedFile(
  file: File,
  rule: FileValidationRule
): { valid: true } | { valid: false; error: string } {
  const extension = getExtension(file.name)

  if (!rule.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Extensión de archivo no permitida (.${extension || "?"}). Formatos aceptados: ${rule.allowedExtensions.join(", ")}.`,
    }
  }

  if (file.type && !rule.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: "El tipo de archivo no coincide con los formatos permitidos.",
    }
  }

  if (file.size > rule.maxSizeBytes) {
    const maxMb = (rule.maxSizeBytes / (1024 * 1024)).toFixed(0)
    return { valid: false, error: `El archivo supera el tamaño máximo permitido (${maxMb}MB).` }
  }

  return { valid: true }
}
