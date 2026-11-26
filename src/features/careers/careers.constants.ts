/**
 * Opciones de los campos de la Base de Altos Potenciales (sección 4 del
 * brief). Fuente única compartida entre el DTO (`create-application.dto.ts`),
 * el formulario multi-paso (`ApplicationForm`) y cualquier vista de admin
 * futura — así ninguno de los tres puede desincronizarse de los otros.
 */

export const DOCUMENT_TYPES = [
  "Cédula de ciudadanía",
  "Cédula de extranjería",
  "Pasaporte",
  "Otro",
] as const

export const EDUCATION_LEVELS = [
  "Bachiller",
  "Técnico",
  "Tecnólogo",
  "Profesional",
  "Especialización",
  "Maestría",
  "Doctorado",
  "Otro",
] as const

export const RELOCATION_OPTIONS = ["Sí", "No", "Depende de la oportunidad"] as const

export const EXPERIENCE_RANGES = [
  "Menos de 1 año",
  "1 a 2 años",
  "3 a 5 años",
  "6 a 10 años",
  "Más de 10 años",
] as const

export const REFERRAL_SOURCES = [
  "LinkedIn",
  "Instagram",
  "Facebook",
  "Página web",
  "Referido",
  "Portal de empleo",
  "Otro",
] as const

/** Sectores de experiencia (sección 4 del brief). Selección múltiple. */
export const EXPERIENCE_SECTORS = [
  "Administración",
  "Oil & Gas",
  "Auditoría",
  "Consultoría",
  "Diseño gráfico",
  "Finanzas",
  "Talento humano",
  "Comercial",
  "Seguridad y Salud en el Trabajo",
  "Transporte y Seguridad Vial",
] as const

export const APPLICATION_FORM_STEPS = [
  { id: "personal", label: "Datos personales" },
  { id: "profesional", label: "Perfil profesional" },
  { id: "sector", label: "Sector de experiencia" },
  { id: "hoja-de-vida", label: "Hoja de vida" },
  { id: "autorizacion", label: "Autorización" },
] as const

export type ApplicationFormStepId = (typeof APPLICATION_FORM_STEPS)[number]["id"]
