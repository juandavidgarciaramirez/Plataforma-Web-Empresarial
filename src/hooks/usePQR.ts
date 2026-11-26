"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { apiGet, apiPostForm } from "@/lib/api/client"
import { trackEvent } from "@/lib/analytics/tracker"

export interface PqrSubmissionResult {
  radicado: string
  status: string
  createdAt: string
}

/** POST /pqr (backend NestJS real, sección 21) — recibe un FormData ya armado por `PQRForm`. */
export function useCreatePqr() {
  return useMutation({
    mutationFn: (formData: FormData) => apiPostForm<PqrSubmissionResult>("/pqr", formData),
    // Solo el tipo de solicitud (petición, queja…); ningún dato del formulario.
    onSuccess: (_result, formData) => trackEvent("pqr_submit", { type: String(formData.get("tipoSolicitud") ?? "") }),
  })
}

/** GET /pqr/:radicado (backend NestJS real, público) */
export function usePqrByRadicado(radicado: string | null) {
  return useQuery({
    queryKey: ["pqr", radicado],
    queryFn: () => apiGet(`/pqr/${radicado}`),
    enabled: Boolean(radicado),
  })
}
