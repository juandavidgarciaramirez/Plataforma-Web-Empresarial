/**
 * Opciones del formulario de postulación pública ("Base de Altos
 * Potenciales", sección 23 del encargo) — porteadas 1:1 desde el backend
 * duplicado que este módulo reemplaza (`src/features/careers/careers.constants.ts`).
 */
export const APPLICATION_DOCUMENT_TYPES = [
  'Cédula de ciudadanía',
  'Cédula de extranjería',
  'Pasaporte',
  'Otro',
] as const;

export const APPLICATION_EDUCATION_LEVELS = [
  'Bachiller',
  'Técnico',
  'Tecnólogo',
  'Profesional',
  'Especialización',
  'Maestría',
  'Doctorado',
  'Otro',
] as const;

export const APPLICATION_RELOCATION_OPTIONS = ['Sí', 'No', 'Depende de la oportunidad'] as const;

export const APPLICATION_EXPERIENCE_RANGES = [
  'Menos de 1 año',
  '1 a 2 años',
  '3 a 5 años',
  '6 a 10 años',
  'Más de 10 años',
] as const;

export const APPLICATION_REFERRAL_SOURCES = [
  'LinkedIn',
  'Instagram',
  'Facebook',
  'Página web',
  'Referido',
  'Portal de empleo',
  'Otro',
] as const;

export const APPLICATION_EXPERIENCE_SECTORS = [
  'Administración',
  'Oil & Gas',
  'Auditoría',
  'Consultoría',
  'Diseño gráfico',
  'Finanzas',
  'Talento humano',
  'Comercial',
  'Seguridad y Salud en el Trabajo',
  'Transporte y Seguridad Vial',
] as const;
