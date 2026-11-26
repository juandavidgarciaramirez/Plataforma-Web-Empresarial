import { apiGet } from "@/lib/api/client"
import { getAllPositions, getPositionBySlug, type JobPosition } from "@/data/careers"

export interface SectionImage {
  url: string
  alt: string | null
}

export type CareersPageImages = Record<"hero" | "talent" | "growth", SectionImage | null>

/** Revalida cada minuto: lo publicado en el administrador aparece sin reconstruir el sitio. */
const init: RequestInit = { next: { revalidate: 60 } }

/**
 * Vacantes abiertas reales (`GET /careers/positions`, las que administra
 * Talento). Si la API no responde se usa el listado estático de
 * `@/data/careers` (vacío hoy), para que la página nunca falle.
 */
export async function getPublicPositions(): Promise<JobPosition[]> {
  return apiGet<JobPosition[]>("/careers/positions", init).catch(() => getAllPositions())
}

export async function getPublicPosition(slug: string): Promise<JobPosition | undefined> {
  return apiGet<JobPosition>(`/careers/positions/${encodeURIComponent(slug)}`, init).catch(() => getPositionBySlug(slug))
}

/** Imágenes de la sección configuradas en el administrador (null = imagen estática por defecto). */
export async function getCareersPageImages(): Promise<CareersPageImages | null> {
  return apiGet<CareersPageImages>("/public/media/careers-page", init).catch(() => null)
}
