"use client"

import { useQuery } from "@tanstack/react-query"
import { mediaService, type MediaContext, type MediaRules, type MediaSlotRule } from "@/services/media.service"

/** Reglas de carga del backend (`GET /media/rules`), compartidas por todos los campos de imagen del panel. */
export function useMediaRules() {
  return useQuery({ queryKey: ["media-rules"], queryFn: mediaService.getRules, staleTime: 10 * 60 * 1000 })
}

export function slotRuleOf(rules: MediaRules | undefined, context: MediaContext, slot: string): MediaSlotRule | undefined {
  return rules?.contexts[context]?.slots[slot]
}

function extensionOf(name: string): string {
  const parts = name.toLowerCase().split(".")
  return parts.length > 1 ? parts[parts.length - 1] : ""
}

/** Validación previa en el navegador (feedback inmediato). El backend vuelve a validar el contenido real. */
export function validateImageFile(file: File, rules: MediaRules | undefined): string | null {
  if (!rules) return null
  const extension = extensionOf(file.name)
  if (!rules.allowedExtensions.includes(extension) || (file.type && !rules.allowedMimeTypes.includes(file.type))) {
    return `Formato no permitido (${file.name}). Formatos aceptados: ${rules.allowedExtensions.join(", ").toUpperCase()}.`
  }
  if (file.size > rules.maxSizeBytes) {
    const max = (rules.maxSizeBytes / (1024 * 1024)).toFixed(0)
    const size = (file.size / (1024 * 1024)).toFixed(1)
    return `"${file.name}" pesa ${size} MB y el máximo permitido es ${max} MB.`
  }
  return null
}

export function acceptFor(rules: MediaRules | undefined): Record<string, string[]> {
  const mimes = rules?.allowedMimeTypes ?? ["image/jpeg", "image/png", "image/webp"]
  const byMime: Record<string, string[]> = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"], "image/avif": [".avif"] }
  return Object.fromEntries(mimes.map((mime) => [mime, byMime[mime] ?? []]))
}

export function uploadErrorMessage(error: unknown): string {
  const response = (error as { response?: { data?: { message?: string; errors?: string[] } } })?.response
  const message = response?.data?.message
  const details = response?.data?.errors?.length ? `: ${response.data.errors.join("; ")}` : ""
  if (message) return `${message}${details}`
  return "No se pudo subir la imagen. Revisa tu conexión e inténtalo de nuevo."
}
