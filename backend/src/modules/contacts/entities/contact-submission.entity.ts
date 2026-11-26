/**
 * Formulario público "Contáctenos" (sección 22 del encargo) — distinto de
 * `crm/contacts` (personas de contacto de una empresa dentro del CRM).
 * Cada envío queda registrado aquí Y (best-effort) genera un Lead real en
 * el CRM vía `LeadsService.captureFromWebForm` (sección 31).
 */
export class ContactSubmissionEntity {
  id!: string;
  name!: string;
  company!: string | null;
  email!: string;
  phone!: string | null;
  serviceInterest!: string;
  message!: string;
  /** Siempre 'WEB' — este endpoint es exclusivamente el formulario público del sitio. */
  source!: 'WEB';
  ip!: string;
  createdAt!: Date;
}
