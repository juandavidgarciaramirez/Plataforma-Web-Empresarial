/**
 * Catálogo de la analítica web propia (Etapa 15). Es la única lista de
 * eventos aceptados por `POST /analytics/collect`: cualquier otro nombre o
 * propiedad se descarta. Las propiedades solo admiten identificadores cortos
 * (slugs, rutas, categorías) — nunca texto libre de formularios, correos,
 * teléfonos ni nombres.
 */
export interface AnalyticsEventDefinition {
  label: string;
  /** Propiedades permitidas (todas opcionales). */
  props: readonly string[];
  /** Acción comercial relevante (ver `isConversion`). */
  conversion: boolean;
}

export const ANALYTICS_EVENTS = {
  whatsapp_click: { label: 'Clic en WhatsApp', props: ['location'], conversion: true },
  email_click: { label: 'Clic en correo', props: ['mailbox', 'location'], conversion: true },
  contact_form_submit: { label: 'Formulario de contacto enviado', props: ['service'], conversion: true },
  pqr_submit: { label: 'Solicitud PQR enviada', props: ['type'], conversion: false },
  yuri_chat_start: { label: 'Conversación iniciada con Yuri', props: [], conversion: false },
  yuri_quote_start: { label: 'Cotización iniciada con Yuri', props: ['service'], conversion: false },
  yuri_quote_complete: { label: 'Cotización completada con Yuri', props: ['service'], conversion: true },
  vacancy_click: { label: 'Clic en una vacante', props: ['vacancy'], conversion: false },
  application_submit: { label: 'Candidatura enviada', props: ['vacancy'], conversion: false },
  service_click: { label: 'Clic en un servicio', props: ['service', 'location'], conversion: false },
} as const satisfies Record<string, AnalyticsEventDefinition>;

export type AnalyticsEventName = keyof typeof ANALYTICS_EVENTS;
export const ANALYTICS_EVENT_NAMES = Object.keys(ANALYTICS_EVENTS) as AnalyticsEventName[];

/**
 * Conversión = acción comercial: contactar a ventas (formulario, WhatsApp,
 * correo comercial) o completar una cotización con Yuri. Un clic en el correo
 * de PQR no es comercial, así que no cuenta.
 */
export function isConversion(name: AnalyticsEventName, props: Record<string, string>): boolean {
  if (name === 'email_click') return props.mailbox === 'comercial';
  return ANALYTICS_EVENTS[name].conversion;
}

/** Valores de propiedad: identificadores cortos o rutas (sin @, espacios ni texto libre). */
export const PROP_VALUE_PATTERN = /^[a-z0-9/][a-z0-9_\-/.]{0,79}$/i;

/** Rutas que nunca son tráfico del sitio público (admin, autenticación, API, estáticos). */
export const EXCLUDED_PATH_PREFIXES = ['/admin', '/login', '/forgot-password', '/reset-password', '/api', '/_next'];

export const CHANNELS = ['direct', 'organic_search', 'social', 'referral', 'email', 'paid', 'campaign'] as const;
export type Channel = (typeof CHANNELS)[number];

/** Inactividad que cierra una sesión (mismo criterio que usa el navegador para rotar el id). */
export const SESSION_TIMEOUT_MINUTES = 30;

/** Tope de registros por sesión: protege contra scripts que inflen una sola sesión. */
export const MAX_HITS_PER_SESSION = 1000;

/** Máximo de eventos por envío. */
export const MAX_EVENTS_PER_BATCH = 25;

export function analyticsTimezone(): string {
  return process.env.ANALYTICS_TIMEZONE || 'America/Bogota';
}

export function retentionDays(): number {
  const value = Number.parseInt(process.env.ANALYTICS_RETENTION_DAYS ?? '', 10);
  return Number.isFinite(value) && value >= 30 ? value : 395;
}
