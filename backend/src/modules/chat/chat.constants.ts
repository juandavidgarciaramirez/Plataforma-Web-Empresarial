/**
 * Catálogo y textos fijos del chat (Fase 16 — Yuri). Reglas + contexto +
 * detección de intención, SIN IA/RAG/vector DB (ver brief, sección 18).
 *
 * El catálogo de servicios y sus keywords se reutiliza tal cual del motor
 * ya implementado en el frontend (`src/config/chatbot.ts` /
 * `src/lib/chatbot/engine.ts`) — no se inventa información comercial nueva.
 * No se importa directamente porque frontend y backend son dos proyectos
 * TypeScript independientes; esta es la copia autoritativa del lado backend.
 */

/** Nombre oficial del asistente virtual. NO CAMBIAR (regla explícita del brief). */
export const ASSISTANT_NAME = 'Yuri';

export const EMAIL_SUBJECT = 'Solicitud de asesoría - Capital Consulting';

/**
 * Mismos valores que `src/config/contact.ts` (frontend) — número de
 * WhatsApp y correo comercial únicos del sitio.
 */
export const CHAT_CONTACT = {
  whatsapp: {
    number: '573118636746',
    display: '311 863 6746',
  },
  email: {
    commercial: 'ejecutivacomercial@capitalconsulting.com.co',
  },
} as const;

/** Rutas públicas del frontend a las que Yuri puede enlazar. */
export const CHAT_ROUTES = {
  pqr: '/pqr',
  careers: '/trabaja-con-nosotros',
  services: '/servicios',
} as const;

export type ChatIntent =
  | 'greeting'
  | 'service_inquiry'
  | 'quote'
  | 'pqr'
  | 'careers'
  | 'contact'
  | 'human_agent'
  | 'unknown';

export interface ChatServiceKnowledge {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  keywords: string[];
  followUpQuestion: string;
  suggestions: string[];
}

/**
 * Las 5 líneas de servicio conocidas por Yuri (sección 20 del brief). Se
 * usan los ids/nombres ya publicados en el sitio: "Capital Talento Humano"
 * del brief corresponde en la plataforma real a "Capital Staffing", y
 * "Capital Soluciones Empresariales" a "Capital Business Services" — no
 * existen páginas separadas con esos nombres genéricos.
 */
export const CHAT_SERVICES: ChatServiceKnowledge[] = [
  {
    id: 'capital-hse',
    name: 'Capital HSE',
    tagline: 'Seguridad y gestión del riesgo',
    intro: 'Claro. Podemos orientarte desde Capital HSE — Seguridad y Salud en el Trabajo y gestión de riesgos.',
    keywords: [
      'sst', 's.s.t', 'seguridad y salud', 'sg-sst', 'sgsst', 'riesgo laboral',
      'riesgos laborales', 'salud ocupacional', 'arl', 'copasst', 'accidente laboral',
      'seguridad industrial', 'hse',
    ],
    followUpQuestion: '¿Tu empresa ya cuenta con un SG-SST implementado o están comenzando desde cero?',
    suggestions: ['Implementar SG-SST', 'Gestionar riesgos', 'Hablar con un asesor'],
  },
  {
    id: 'capital-learning',
    name: 'Capital Learning',
    tagline: 'Formación y desarrollo',
    intro: 'Entonces probablemente te interese Capital Learning: formación y desarrollo empresarial.',
    keywords: [
      'capacitacion', 'capacitaciones', 'capacitar', 'formacion', 'entrenar',
      'entrenamiento', 'curso', 'cursos', 'taller', 'talleres', 'aprendizaje', 'learning',
    ],
    followUpQuestion: '¿Buscas capacitación para líderes específicos o para todo el equipo?',
    suggestions: ['Ver líneas de formación', 'Cotizar capacitación', 'Hablar con un asesor'],
  },
  {
    id: 'capital-mobility',
    name: 'Capital Mobility',
    tagline: 'Seguridad vial',
    intro: 'Para eso está Capital Mobility: seguridad vial y gestión del riesgo en carretera.',
    keywords: [
      'pesv', 'seguridad vial', 'movilidad', 'conductor', 'conductores', 'flota',
      'transito', 'accidente de transito', 'siniestro vial', 'mobility',
    ],
    followUpQuestion: '¿Necesitas implementar el PESV desde cero, actualizarlo o gestionar un riesgo vial específico?',
    suggestions: ['PESV', 'Seguridad vial', 'Hablar con un asesor'],
  },
  {
    id: 'capital-staffing',
    name: 'Capital Staffing',
    tagline: 'Selección y talento humano',
    intro: 'Podemos ayudarte con eso desde Capital Staffing: selección, gestión humana y desarrollo de talento.',
    keywords: [
      'personal', 'seleccion', 'talento', 'talento humano', 'recursos humanos', 'rrhh',
      'vacante', 'vacantes', 'contratar', 'reclutamiento', 'reclutar', 'gestion humana', 'staffing',
    ],
    followUpQuestion: '¿Buscas cubrir una vacante específica o fortalecer toda tu gestión de talento humano?',
    suggestions: ['Selección', 'Gestión Humana', 'Hablar con un asesor'],
  },
  {
    id: 'capital-business-services',
    name: 'Capital Business Services',
    tagline: 'Soluciones administrativas y financieras',
    intro: 'Eso lo vemos en Capital Business Services: nómina, contabilidad, tributaria y laboral.',
    keywords: [
      'contabilidad', 'contable', 'nomina', 'tributaria', 'tributario', 'impuestos',
      'administrativo', 'financiero', 'outsourcing', 'laboral', 'business services',
      'soluciones empresariales',
    ],
    followUpQuestion: '¿Tu necesidad es más de nómina y contabilidad, o de temas tributarios y laborales?',
    suggestions: ['Nómina y contabilidad', 'Tributario y laboral', 'Hablar con un asesor'],
  },
];

export const DEFAULT_SUGGESTIONS = ['Ver servicios', 'Solicitar cotización', 'Hablar con un asesor'];

export function findServiceById(id: string | null | undefined): ChatServiceKnowledge | undefined {
  return CHAT_SERVICES.find((service) => service.id === id);
}

/** Frases (normalizadas) que disparan cada intención — sección 19 del brief. */
export const HUMAN_AGENT_PHRASES = [
  'quiero un asesor', 'quiero hablar con alguien', 'quiero una persona',
  'quiero una cotizacion personalizada', 'cotizacion personalizada',
  'hablar con alguien', 'hablar con una persona', 'persona real',
  'hablar con un humano', 'atencion humana', 'asesor humano', 'un asesor',
];

export const QUOTE_PHRASES = [
  'cotizacion',
  'cotizar',
  'quiero cotizar',
  'necesito una cotizacion',
  'precio',
  'precios',
  'cuanto cuesta',
  'cuanto vale',
  'que cuesta',
  'que valor tiene',
  'tarifa',
  'costo',
  'costos',
  'presupuesto',
];

export const PQR_PHRASES = ['pqr', 'queja', 'reclamo', 'peticion', 'sugerencia', 'radicar'];

export const CAREERS_PHRASES = [
  'trabajar con ustedes', 'trabajar con capital', 'unirme a su equipo', 'unirme al equipo',
  'postularme', 'enviar mi hoja de vida', 'enviar hoja de vida', 'hoja de vida',
  'aplicar a una vacante', 'buscar empleo', 'quiero trabajar en capital', 'quiero trabajar con ustedes',
];

export const CONTACT_PHRASES = [
  'como los contacto', 'como puedo contactarlos', 'datos de contacto', 'correo electronico',
  'numero de telefono', 'telefono de contacto', 'donde estan ubicados', 'direccion',
];

export const GREETING_PHRASES = ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que tal'];

/**
 * Valor que guarda la sesión cuando el visitante responde que no representa a
 * ninguna empresa, para que el flujo de cotización avance. Nunca llega al CRM
 * como empresa: el contacto queda en la empresa técnica "Sin Empresa".
 */
export const NO_COMPANY_ANSWER = 'Sin empresa';

export const POSITIVE_WORDS = ['si', 'claro', 'ya', 'ya tenemos', 'tenemos', 'existe', 'correcto', 'exacto'];
export const NEGATIVE_WORDS = ['no', 'aun no', 'todavia no', 'nada', 'ninguno', 'cero', 'no tenemos'];
export const ADVISOR_INTENT_WORDS = ['asesor', 'hablar', 'persona', 'directo', 'directamente', 'llamada'];

export const INDUSTRY_KEYWORDS: Record<string, string> = {
  transporte: 'transporte',
  logistica: 'transporte',
  flota: 'transporte',
  construccion: 'construcción',
  educacion: 'educación',
  tecnologia: 'tecnología',
  manufactura: 'manufactura',
  retail: 'retail',
  comercio: 'comercio',
  financiero: 'financiero',
  banca: 'financiero',
  energia: 'energía',
  mineria: 'minería',
  alimentos: 'alimentos',
};
