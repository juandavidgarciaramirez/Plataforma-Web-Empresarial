import { apiGet } from "@/lib/api/client"
import type { GalleryImage } from "@/data/news"

/** Forma devuelta por `/api/v1/public/services` (backend NestJS, Etapa 15). */
export interface PublicServiceMedia {
  slug: string
  name: string
  shortDescription: string
  imageUrl: string | null
  imageAlt: string | null
  gallery: GalleryImage[]
}

/** Revalida cada minuto: los cambios del administrador se ven sin reconstruir el sitio. */
const init: RequestInit = { next: { revalidate: 60 } }

/**
 * Imágenes administrables de una línea de servicio. Si la API no responde,
 * devuelve null y la página conserva su imagen estática actual.
 */
export async function getServiceMedia(slug: string): Promise<PublicServiceMedia | null> {
  return apiGet<PublicServiceMedia>(`/public/services/${slug}`, init).catch(() => null)
}

export async function getServicesMedia(): Promise<PublicServiceMedia[]> {
  return apiGet<PublicServiceMedia[]>("/public/services", init).catch(() => [])
}
