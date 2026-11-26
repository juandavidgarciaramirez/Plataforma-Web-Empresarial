import { CONTACT } from "@/config/contact"

/**
 * Fuente única de verdad para el asesor virtual "Capi": identidad, catálogo
 * de servicios (con keywords para detección de intención), mensajes fijos y
 * rutas. Nada de esto debe hardcodearse dentro de los componentes — ver
 * brief "Rediseño del chatbot", sección 32.
 *
 * El contenido de cada servicio (nombre, tagline, descripción) se toma tal
 * cual de `src/data/services.ts` — no se inventa información comercial.
 *
 * Nota sobre "Capital Talento Humano": el brief original menciona una línea
 * genérica de Talento Humano que, en la plataforma actual, no existe como
 * página independiente — la línea real y publicada es Capital Staffing
 * (selección y reclutamiento). Las intenciones de "personal / talento /
 * recursos humanos / vacante" se enrutan directamente a Capital Staffing en
 * lugar de inventar un servicio sin página propia (regla 23 del brief).
 */

export const ASSISTANT = {
  name: "Yuri",
  role: "Asistente virtual",
  company: "Capital Consulting",
  status: "En línea",
} as const

export const ROUTES = {
  pqr: "/pqr",
  careers: "/trabaja-con-nosotros",
  contact: "/contacto",
  services: "/servicios",
} as const

export const EMAIL_SUBJECT = "Solicitud de asesoría - Capital Consulting"

export interface ChatServiceKnowledge {
  id: string
  name: string
  tagline: string
  description: string
  href: string
  /** Palabras clave normalizadas (sin tildes, minúsculas) para detección de intención. */
  keywords: string[]
  /** Pregunta de seguimiento que ancla el contexto de conversación en este servicio. */
  followUpQuestion: string
  /** Clave usada en ChatContext.pendingQuestion mientras se espera la respuesta a followUpQuestion. */
  pendingKey: string
  /** Sugerencias contextuales mostradas mientras este servicio es el tema activo. */
  suggestions: string[]
}

export const CHAT_SERVICES: ChatServiceKnowledge[] = [
  {
    id: "capital-hse",
    name: "Capital HSE",
    tagline: "Seguridad y gestión del riesgo",
    description: "Seguridad y Salud en el Trabajo, riesgos laborales y bienestar.",
    href: "/servicios/capital-hse",
    keywords: [
      "sst",
      "s.s.t",
      "seguridad y salud",
      "sg-sst",
      "sgsst",
      "riesgo laboral",
      "riesgos laborales",
      "salud ocupacional",
      "arl",
      "copasst",
      "accidente laboral",
      "seguridad industrial",
    ],
    followUpQuestion:
      "¿Tu empresa ya cuenta con un SG-SST implementado o están comenzando desde cero?",
    pendingKey: "hse_sgsst_status",
    suggestions: ["Implementar SG-SST", "Gestionar riesgos", "Hablar con un asesor"],
  },
  {
    id: "capital-learning",
    name: "Capital Learning",
    tagline: "Formación y desarrollo",
    description:
      "Formación que transforma el talento: portafolio de servicios de capacitación empresarial.",
    href: "/servicios/capital-learning",
    keywords: [
      "capacitacion",
      "capacitaciones",
      "capacitar",
      "formacion",
      "entrenar",
      "entrenamiento",
      "curso",
      "cursos",
      "taller",
      "talleres",
      "aprendizaje",
    ],
    followUpQuestion: "¿Buscas capacitación para líderes específicos o para todo el equipo?",
    pendingKey: "learning_audience",
    suggestions: ["Ver líneas de formación", "Cotizar capacitación", "Hablar con un asesor"],
  },
  {
    id: "capital-mobility",
    name: "Capital Mobility",
    tagline: "Seguridad vial",
    description:
      "Seguridad vial: consultoría, implementación y gestión del riesgo vial para organizaciones con flota.",
    href: "/servicios/capital-mobility",
    keywords: [
      "pesv",
      "seguridad vial",
      "movilidad",
      "conductor",
      "conductores",
      "flota",
      "transito",
      "accidente de transito",
      "siniestro vial",
    ],
    followUpQuestion:
      "¿Necesitas implementar el PESV desde cero, actualizarlo o gestionar un riesgo vial específico?",
    pendingKey: "mobility_need",
    suggestions: ["PESV", "Seguridad vial", "Hablar con un asesor"],
  },
  {
    id: "capital-staffing",
    name: "Capital Staffing",
    tagline: "Selección y talento humano",
    description:
      "Conectamos el mejor talento con las mejores empresas: reclutamiento que reduce el riesgo, acelera la operación y sostiene el crecimiento.",
    href: "/servicios/capital-staffing",
    keywords: [
      "personal",
      "seleccion",
      "talento",
      "talento humano",
      "recursos humanos",
      "rrhh",
      "vacante",
      "vacantes",
      "contratar",
      "reclutamiento",
      "reclutar",
      "gestion humana",
    ],
    followUpQuestion:
      "¿Buscas cubrir una vacante específica o fortalecer toda tu gestión de talento humano?",
    pendingKey: "staffing_need",
    suggestions: ["Selección", "Gestión Humana", "Hablar con un asesor"],
  },
  {
    id: "capital-business-services",
    name: "Capital Business Services",
    tagline: "Soluciones administrativas y financieras",
    description: "Soluciones empresariales: nómina, contabilidad, tributaria y laboral.",
    href: "/servicios/capital-business-services",
    keywords: [
      "contabilidad",
      "contable",
      "nomina",
      "tributaria",
      "tributario",
      "impuestos",
      "administrativo",
      "financiero",
      "outsourcing",
      "laboral",
    ],
    followUpQuestion:
      "¿Tu necesidad es más de nómina y contabilidad, o de temas tributarios y laborales?",
    pendingKey: "business_area",
    suggestions: ["Nómina y contabilidad", "Tributario y laboral", "Hablar con un asesor"],
  },
]

export const DEFAULT_SUGGESTIONS = ["Ver servicios", "Solicitar cotización", "Hablar con un asesor"]

/** Secuencia de mensajes que Yuri envía al abrir el chat por primera vez en la sesión. */
export const INITIAL_MESSAGES = [
  "Hola 👋 Soy Yuri, la asistente virtual de Capital Consulting.",
  "Puedo ayudarte a conocer nuestros servicios, orientarte según tu necesidad o conectarte con un asesor.",
  "¿Qué necesitas resolver hoy?",
]

export function findServiceById(id: string | undefined): ChatServiceKnowledge | undefined {
  return CHAT_SERVICES.find((service) => service.id === id)
}

export function findServiceByPendingKey(key: string | undefined): ChatServiceKnowledge | undefined {
  return CHAT_SERVICES.find((service) => service.pendingKey === key)
}

export { CONTACT }
