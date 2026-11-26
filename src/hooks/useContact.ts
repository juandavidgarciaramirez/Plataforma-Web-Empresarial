"use client"

import { useMutation } from "@tanstack/react-query"
import { apiPostJson } from "@/lib/api/client"
import type { CreateContactDto } from "@/features/contact/dto/create-contact.dto"
import { trackEvent } from "@/lib/analytics/tracker"

/** Forma real devuelta por `POST /contacts` (backend NestJS, `ContactSubmissionEntity`). */
export interface ContactSubmissionResult {
  id: string
  name: string
  company: string | null
  email: string
  phone: string | null
  serviceInterest: string
  message: string
  source: "WEB"
  createdAt: string
}

/** POST /contacts (backend NestJS real, sección 22) */
export function useCreateContact() {
  return useMutation({
    mutationFn: (payload: CreateContactDto) =>
      apiPostJson<ContactSubmissionResult>("/contacts", payload),
    // Conversión: solo la línea de servicio elegida, nunca los datos del formulario.
    onSuccess: (_result, payload) => trackEvent("contact_form_submit", { service: payload.servicioInteres }),
  })
}
