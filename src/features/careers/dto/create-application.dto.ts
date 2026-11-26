import { z } from "zod"
import {
  DOCUMENT_TYPES,
  EDUCATION_LEVELS,
  RELOCATION_OPTIONS,
  EXPERIENCE_RANGES,
  REFERRAL_SOURCES,
  EXPERIENCE_SECTORS,
} from "../careers.constants"

const PHONE_REGEX = /^[0-9+()\s-]{7,20}$/

/**
 * DTO de postulación a la Base de Altos Potenciales (secciones 3-4 del
 * brief "Trabaja con nosotros"). Cubre exactamente los 14 campos solicitados
 * — no más, no menos — más el sector de experiencia (selección múltiple) y
 * las tres autorizaciones (sección 7-8). La hoja de vida no está aquí:
 * es un archivo y se valida aparte con `validateUploadedFile` (sección 4,
 * bloque "Hoja de vida").
 *
 * `vacanteSlug` no es uno de los 14 campos: es metadata opcional que solo se
 * envía cuando la postulación viene desde la página de una vacante puntual
 * (`/trabaja-con-nosotros/[slug]`), para asociarla a esa oportunidad.
 */
export const createApplicationDto = z.object({
  // --- Datos personales (campos 1-6) ---
  nombreCompleto: z
    .string()
    .trim()
    .min(3, "El nombre completo es muy corto")
    .max(150, "El nombre completo es muy largo"),
  tipoDocumento: z.enum(DOCUMENT_TYPES, { message: "Selecciona un tipo de documento" }),
  numeroDocumento: z
    .string()
    .trim()
    .min(4, "El número de documento es muy corto")
    .max(30, "El número de documento es muy largo"),
  celular: z.string().trim().regex(PHONE_REGEX, "Número de celular inválido"),
  correo: z.string().trim().email("Correo electrónico inválido"),
  ciudadPais: z
    .string()
    .trim()
    .min(2, "Indica tu ciudad y país de residencia")
    .max(150, "Este campo es muy largo"),

  // --- Perfil profesional (campos 7-13) ---
  cargoAspirado: z
    .string()
    .trim()
    .min(2, "Indica el cargo al que deseas postularte")
    .max(150, "Este campo es muy largo"),
  aniosExperiencia: z.enum(EXPERIENCE_RANGES, {
    message: "Selecciona tus años de experiencia en el cargo",
  }),
  nivelEducativo: z.enum(EDUCATION_LEVELS, { message: "Selecciona tu nivel educativo" }),
  disponibilidad: z.enum(RELOCATION_OPTIONS, {
    message: "Indica tu disponibilidad para viajar o reubicarte",
  }),
  linkedin: z.string().trim().max(200, "Este campo es muy largo").optional().or(z.literal("")),
  aspiracionSalarial: z.string().trim().max(100, "Este campo es muy largo").optional().or(z.literal("")),
  comoSeEntero: z.enum(REFERRAL_SOURCES).optional().or(z.literal("")),

  // --- Sector de experiencia (campo 14, selección múltiple) ---
  sectores: z.array(z.enum(EXPERIENCE_SECTORS)).min(1, "Selecciona al menos un sector de experiencia"),

  // --- Vacante asociada (opcional, no es uno de los 14 campos) ---
  vacanteSlug: z.string().trim().max(150).optional().or(z.literal("")),

  // --- Autorizaciones (sección 7-8 del brief) ---
  autorizacionDatos: z
    .boolean()
    .refine((v) => v === true, "Debes autorizar el tratamiento de datos personales para continuar"),
  // Sin `.default()` a propósito: con `.default()` zod genera un tipo de
  // entrada distinto al de salida (uno opcional, el otro requerido) y
  // `zodResolver` deja de encajar con `useForm<CreateApplicationDto>`. El
  // `false` inicial ya lo pone `defaultValues` en `ApplicationForm`.
  autorizacionComunicaciones: z.boolean().optional(),
  autorizacionCompartirHV: z.boolean().optional(),
})

export type CreateApplicationDto = z.infer<typeof createApplicationDto>

/** Nombres de campo agrupados por paso, usados por el wizard para validar por bloques. */
export const APPLICATION_STEP_FIELDS = {
  personal: ["nombreCompleto", "tipoDocumento", "numeroDocumento", "celular", "correo", "ciudadPais"],
  profesional: [
    "cargoAspirado",
    "aniosExperiencia",
    "nivelEducativo",
    "disponibilidad",
    "linkedin",
    "aspiracionSalarial",
    "comoSeEntero",
  ],
  sector: ["sectores"],
  "hoja-de-vida": [],
  autorizacion: ["autorizacionDatos", "autorizacionComunicaciones", "autorizacionCompartirHV"],
} as const satisfies Record<string, (keyof CreateApplicationDto)[]>
