export const APPLICATION_STATUSES = ['RECEIVED', 'REVIEWED', 'REJECTED', 'HIRED'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/**
 * Evidencia del consentimiento (sección 24 del encargo): queda asociada a
 * cada postulación para poder demostrar, si Capital Consulting lo requiere,
 * en qué momento, desde qué IP y bajo qué versión de la política el titular
 * autorizó el tratamiento de sus datos.
 */
export interface ApplicationConsentEvidence {
  timestamp: Date;
  ip: string;
  policyVersion: string;
  /** Snapshot exacto del texto legal mostrado al momento de la autorización. */
  consentText: string;
  dataConsent: boolean;
  communicationsConsent: boolean;
  shareCvConsent: boolean;
}

export class ApplicationEntity {
  id!: string;
  vacancyId!: string | null;
  vacancyTitle!: string;
  fullName!: string;
  email!: string;
  phone!: string | null;
  cvUrl!: string | null;
  message!: string | null;
  status!: ApplicationStatus;
  createdAt!: Date;
  updatedAt!: Date;

  // --- Campos ricos del formulario público (sección 23 del encargo) ---
  // Etapa 3 (2026-08-26): agregados al consolidar el segundo backend
  // (Next.js, `src/features/careers`) en esta única implementación real.
  // Todos opcionales/null por defecto para no romper las postulaciones que
  // ya existían con la forma simple anterior.
  documentType!: string | null;
  documentNumber!: string | null;
  city!: string | null;
  experienceRange!: string | null;
  educationLevel!: string | null;
  relocation!: string | null;
  linkedin!: string | null;
  salaryExpectation!: string | null;
  referralSource!: string | null;
  sectors!: string[];
  cvFileName!: string | null;
  cvSizeBytes!: number | null;
  cvMimeType!: string | null;
  consent!: ApplicationConsentEvidence | null;

  /** Id real en `foundation.files` de la hoja de vida ya registrada (Etapa 14) — opcional: solo se usa al crear. */
  cvFileId?: string | null;
}
