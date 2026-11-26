"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { apiGet, apiPostForm } from "@/lib/api/client"
import type { JobPosition } from "@/data/careers"
import { trackEvent } from "@/lib/analytics/tracker"

export interface ApplicationSubmissionResult {
  id: string
  status: string
}

/**
 * GET /careers/positions (backend NestJS real). Sin uso actual en las
 * páginas públicas — `/trabaja-con-nosotros` sigue leyendo el archivo
 * estático `@/data/careers.ts` directamente (Server Component). Se deja
 * lista para cuando esas páginas se conecten al backend real (ver
 * docs/backend-audit.md, CMS de Careers pendiente).
 */
export function usePositions() {
  return useQuery({
    queryKey: ["careers", "positions"],
    queryFn: () => apiGet<JobPosition[]>("/careers/positions"),
  })
}

/** GET /careers/positions/:slug (backend NestJS real) */
export function usePosition(slug: string | null) {
  return useQuery({
    queryKey: ["careers", "positions", slug],
    queryFn: () => apiGet<JobPosition>(`/careers/positions/${slug}`),
    enabled: Boolean(slug),
  })
}

/** POST /careers/applications (backend NestJS real, sección 23) — recibe un FormData ya armado por `ApplicationForm`. */
export function useCreateApplication() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiPostForm<ApplicationSubmissionResult>("/careers/applications", formData),
    // Solo la vacante (o la base general); ningún dato del candidato.
    onSuccess: (_result, formData) =>
      trackEvent("application_submit", { vacancy: String(formData.get("vacanteSlug") || "base-general") }),
  })
}
