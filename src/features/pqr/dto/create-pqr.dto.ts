import { z } from "zod"

export const TIPOS_SOLICITUD_PQR = [
  "PETICION",
  "QUEJA",
  "RECLAMO",
  "SUGERENCIA",
  "FELICITACION",
] as const

export type TipoSolicitudPqr = (typeof TIPOS_SOLICITUD_PQR)[number]

export const TIPOS_SOLICITUD_PQR_LABELS: Record<TipoSolicitudPqr, string> = {
  PETICION: "Petición",
  QUEJA: "Queja",
  RECLAMO: "Reclamo",
  SUGERENCIA: "Sugerencia",
  FELICITACION: "Felicitación",
}

export const TIPOS_DOCUMENTO = ["CC", "CE", "NIT", "PASAPORTE", "OTRO"] as const
export const TIPOS_DOCUMENTO_LABELS: Record<(typeof TIPOS_DOCUMENTO)[number], string> = {
  CC: "Cédula de ciudadanía",
  CE: "Cédula de extranjería",
  NIT: "NIT",
  PASAPORTE: "Pasaporte",
  OTRO: "Otro",
}

/**
 * DTO de creación de una PQR. Valida exactamente los campos del formulario
 * (sección 3 del brief); el archivo adjunto se valida aparte con
 * `validateUploadedFile` porque no es un campo escalar.
 */
export const createPqrDto = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(3, "El nombre completo es muy corto")
    .max(150, "El nombre completo es muy largo"),
  tipoDocumento: z.enum(TIPOS_DOCUMENTO).optional(),
  numeroDocumento: z.string().trim().max(30).optional().or(z.literal("")),
  correo: z.string().trim().email("Correo electrónico inválido"),
  telefono: z
    .string()
    .trim()
    .regex(/^[0-9+()\s-]{7,20}$/, "Teléfono inválido")
    .optional()
    .or(z.literal("")),
  empresa: z.string().trim().max(150).optional().or(z.literal("")),
  tipoSolicitud: z.enum(TIPOS_SOLICITUD_PQR, {
    message: "Selecciona un tipo de solicitud válido",
  }),
  asunto: z.string().trim().min(5, "El asunto es muy corto").max(200, "El asunto es muy largo"),
  descripcion: z
    .string()
    .trim()
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(3000, "La descripción es muy larga"),
  consentimiento: z
    .boolean()
    .refine((v) => v === true, "Debes autorizar el tratamiento de datos personales"),
})

export type CreatePqrDto = z.infer<typeof createPqrDto>
