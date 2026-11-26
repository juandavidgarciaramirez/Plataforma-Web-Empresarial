/**
 * Fuente de datos de "Trabaja con nosotros" — mismo patrón que `news.ts`:
 * el listado, las tarjetas y el detalle son genéricos, y agregar una vacante
 * nueva es agregar un objeto a `jobPositions` (no requiere tocar componentes
 * ni rutas).
 *
 * Arranca vacío a propósito: hoy no hay vacantes reales que publicar, y el
 * propio diseño (sección 7 del brief) contempla el estado "sin vacantes
 * disponibles" como un caso válido de la página, no un placeholder temporal.
 * Cuando Capital Consulting tenga una vacante real, agrégala aquí.
 */

import type { GalleryImage } from "./news"

export type Modalidad = "Presencial" | "Remoto" | "Híbrido"
export type TipoContrato = "Término indefinido" | "Término fijo" | "Prestación de servicios" | "Aprendizaje"

export interface JobPosition {
  slug: string
  cargo: string
  area: string
  ubicacion: string
  modalidad: Modalidad
  tipoContrato: TipoContrato
  /** ISO date de publicación. */
  fecha: string
  descripcion: string
  responsabilidades: string[]
  requisitos: string[]
  queOfrecemos: string[]
  /** Imagen de portada administrable (Etapa 15). */
  imagen?: { url: string; alt: string | null } | null
  /** Imágenes ilustrativas administrables (Etapa 15). */
  galeria?: GalleryImage[]
}

export const jobPositions: JobPosition[] = []

export function getAllPositions(): JobPosition[] {
  return jobPositions
}

export function getPositionBySlug(slug: string): JobPosition | undefined {
  return jobPositions.find((position) => position.slug === slug)
}
