import { buildWhatsAppUrl, CONTACT } from "@/config/contact"
import {
  CHAT_SERVICES,
  DEFAULT_SUGGESTIONS,
  EMAIL_SUBJECT,
  ROUTES,
  findServiceById,
  findServiceByPendingKey,
  type ChatServiceKnowledge,
} from "@/config/chatbot"

/**
 * Motor de conversación de Capi — reglas ligeras de detección de intención
 * más un contexto de sesión (servicio identificado, nombre, industria,
 * pregunta pendiente). Sin IA, sin llamadas de red: fase 1 del brief
 * (sección 33 — el backend real se conecta después).
 *
 * `processUserMessage` es una función pura: recibe el contexto actual y el
 * texto crudo del usuario, devuelve la respuesta y el contexto actualizado.
 */

export type ChatBlock =
  | { type: "text"; text: string }
  | { type: "card"; service: { id: string; name: string; tagline: string; href: string } }
  | { type: "advisor"; whatsappUrl: string; mailUrl: string }
  | { type: "link"; label: string; href: string }

export interface ChatContext {
  name?: string
  industry?: string
  serviceId?: string
  pendingQuestion?: string
  lastUserMessage?: string
}

export interface EngineReply {
  blocks: ChatBlock[]
  suggestions: string[]
  context: ChatContext
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase))
}

const RESET_PHRASES = [
  "reiniciar conversacion",
  "reiniciar",
  "empezar de nuevo",
  "borrar conversacion",
  "nueva conversacion",
]

const ADVISOR_PHRASES = [
  "asesor",
  "hablar con alguien",
  "hablar con una persona",
  "persona real",
  "ayuda personalizada",
  "no se cual",
  "no se que servicio",
  "no se cual necesito",
  "no estoy seguro",
  "no estoy segura",
  "hablar con un humano",
  "atencion humana",
  "cotizacion",
  "cotizar",
  "presupuesto",
  "tarifa",
]

const PQR_PHRASES = ["pqr", "queja", "reclamo", "peticion", "sugerencia", "radicar"]

const CAREERS_PHRASES = [
  "trabajar con ustedes",
  "trabajar con capital",
  "unirme a su equipo",
  "unirme al equipo",
  "postularme",
  "enviar mi hoja de vida",
  "enviar hoja de vida",
  "hoja de vida",
  "aplicar a una vacante",
  "buscar empleo",
  "quiero trabajar en capital",
]

const GREETING_PHRASES = ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "que tal"]

const SERVICES_OVERVIEW_PHRASES = [
  "ver servicios",
  "conocer los servicios",
  "conocer nuestros servicios",
  "conocer sus servicios",
  "que servicios",
  "cuales son sus servicios",
  "servicios ofrecen",
  "portafolio de servicios",
]

const POSITIVE_WORDS = ["si", "claro", "ya", "ya tenemos", "tenemos", "existe", "correcto", "exacto"]
const NEGATIVE_WORDS = ["no", "aun no", "todavia no", "nada", "ninguno", "cero", "no tenemos"]

const ADVISOR_INTENT_WORDS = ["asesor", "hablar", "persona", "directo", "directamente", "llamada"]

const NAME_RE = /\b(?:me llamo|mi nombre es|soy)\s+([a-zA-ZÁÉÍÓÚÑÜáéíóúñü]{2,20})/i
const NAME_STOPWORDS = new Set([
  "de",
  "del",
  "una",
  "un",
  "el",
  "la",
  "los",
  "las",
  "parte",
  "cliente",
  "representante",
  "gerente",
  "director",
  "encargado",
  "encargada",
  "nuevo",
  "nueva",
  "empresa",
  "compania",
  "dueno",
  "duena",
])

function extractName(rawText: string): { name?: string; rest: string } {
  const match = rawText.match(NAME_RE)
  if (!match || match.index === undefined) return { rest: rawText }
  const candidate = match[1]
  if (NAME_STOPWORDS.has(candidate.toLowerCase())) return { rest: rawText }
  const name = candidate[0].toUpperCase() + candidate.slice(1).toLowerCase()
  const rest = (rawText.slice(0, match.index) + rawText.slice(match.index + match[0].length)).trim()
  return { name, rest }
}

const INDUSTRY_KEYWORDS: Record<string, string> = {
  transporte: "transporte",
  logistica: "transporte",
  flota: "transporte",
  construccion: "construcción",
  educacion: "educación",
  tecnologia: "tecnología",
  manufactura: "manufactura",
  retail: "retail",
  comercio: "comercio",
  financiero: "financiero",
  banca: "financiero",
  energia: "energía",
  mineria: "minería",
  alimentos: "alimentos",
}

function detectIndustry(normalizedText: string): string | undefined {
  for (const [keyword, label] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (normalizedText.includes(keyword)) return label
  }
  return undefined
}

function detectService(normalizedText: string): ChatServiceKnowledge | undefined {
  let best: { service: ChatServiceKnowledge; score: number } | undefined
  for (const service of CHAT_SERVICES) {
    const score = service.keywords.reduce((acc, kw) => acc + (normalizedText.includes(kw) ? 1 : 0), 0)
    if (score > 0 && (!best || score > best.score)) best = { service, score }
  }
  return best?.service
}

function toCard(service: ChatServiceKnowledge): ChatBlock {
  return { type: "card", service: { id: service.id, name: service.name, tagline: service.tagline, href: service.href } }
}

function suggestionsFor(context: ChatContext): string[] {
  const service = findServiceById(context.serviceId)
  return service ? service.suggestions : DEFAULT_SUGGESTIONS
}

function pendingQuestionText(context: ChatContext): string {
  if (context.pendingQuestion === "offer_advisor") {
    return "¿Quieres que te explique brevemente cómo podemos ayudarte o prefieres hablar con un asesor?"
  }
  const service = findServiceByPendingKey(context.pendingQuestion)
  return service?.followUpQuestion ?? "¿Qué necesitas resolver hoy?"
}

function advisorBlocks(context: ChatContext): ChatBlock[] {
  const service = findServiceById(context.serviceId)
  const waMessage = service
    ? `Hola, vengo del sitio web de Capital Consulting y quiero recibir asesoría sobre ${service.name}.`
    : "Hola, vengo del sitio web de Capital Consulting y quiero recibir asesoría."
  const whatsappUrl = buildWhatsAppUrl(waMessage)

  const bodyLines = [
    `Servicio detectado: ${service?.name ?? "No especificado"}`,
    `Necesidad: ${context.lastUserMessage ?? "No especificada"}`,
  ]
  const mailUrl = `mailto:${CONTACT.emails.commercial}?subject=${encodeURIComponent(
    EMAIL_SUBJECT,
  )}&body=${encodeURIComponent(bodyLines.join("\n"))}`

  return [
    { type: "text", text: "Claro. Te conecto con nuestro equipo." },
    { type: "text", text: "¿Cómo prefieres continuar?" },
    { type: "advisor", whatsappUrl, mailUrl },
  ]
}

function handlePendingQuestion(context: ChatContext, normalizedText: string): EngineReply {
  const key = context.pendingQuestion

  if (key === "offer_advisor") {
    if (includesAny(normalizedText, ADVISOR_INTENT_WORDS)) {
      return { blocks: advisorBlocks(context), suggestions: [], context: { ...context, pendingQuestion: undefined } }
    }
    const service = findServiceById(context.serviceId)
    const blocks: ChatBlock[] = service
      ? [
          { type: "text", text: service.description },
          toCard(service),
          { type: "text", text: "¿Te gustaría profundizar en algún punto o prefieres hablar con un asesor?" },
        ]
      : [{ type: "text", text: "Con gusto. ¿Qué te gustaría saber?" }]
    return { blocks, suggestions: suggestionsFor(context), context: { ...context, pendingQuestion: undefined } }
  }

  let ack = "Entendido, cuéntame un poco más sobre lo que necesitas."
  if (key === "hse_sgsst_status") {
    if (includesAny(normalizedText, NEGATIVE_WORDS)) {
      ack = "Entendido. Entonces buscas implementarlo desde cero. Capital HSE puede acompañarte en todo el proceso."
    } else if (includesAny(normalizedText, POSITIVE_WORDS)) {
      ack = "Perfecto, entonces podemos ayudarte a revisarlo, actualizarlo o fortalecerlo."
    }
  } else if (key === "staffing_need") {
    if (normalizedText.includes("vacante")) {
      ack = "Entendido, para cubrir una vacante puntual Capital Staffing gestiona todo el proceso de selección por ti."
    } else if (includesAny(normalizedText, ["gestion", "fortalecer", "todo"])) {
      ack = "Entendido, entonces hablamos de fortalecer la gestión de talento humano en general."
    }
  } else if (key === "mobility_need") {
    if (includesAny(normalizedText, ["cero", "nuevo", "no tenemos"])) {
      ack = "Entendido, entonces empezamos por diseñar el PESV desde cero."
    } else if (normalizedText.includes("actualizar")) {
      ack = "Entendido, entonces hablamos de actualizar o auditar el PESV existente."
    } else if (normalizedText.includes("riesgo")) {
      ack = "Entendido, podemos enfocarnos en ese riesgo vial específico."
    }
  } else if (key === "business_area") {
    if (includesAny(normalizedText, ["nomina", "contabilidad"])) {
      ack = "Entendido, nos enfocamos en nómina y contabilidad."
    } else if (includesAny(normalizedText, ["tributari", "laboral"])) {
      ack = "Entendido, nos enfocamos en temas tributarios y laborales."
    }
  } else if (key === "learning_audience") {
    if (normalizedText.includes("lider")) {
      ack = "Entendido, formación enfocada en líderes."
    } else if (includesAny(normalizedText, ["equipo", "todos"])) {
      ack = "Entendido, formación para todo el equipo."
    }
  }

  return {
    blocks: [{ type: "text", text: ack }, { type: "text", text: pendingQuestionText({ ...context, pendingQuestion: "offer_advisor" }) }],
    suggestions: suggestionsFor(context),
    context: { ...context, pendingQuestion: "offer_advisor" },
  }
}

const SERVICE_INTROS: Record<string, string> = {
  "capital-hse": "Claro. Podemos orientarte desde Capital HSE — seguridad y salud en el trabajo y gestión de riesgos.",
  "capital-learning": "Entonces probablemente te interese Capital Learning. Trabajamos formación y desarrollo.",
  "capital-mobility": "Para eso está Capital Mobility — seguridad vial y gestión del riesgo en carretera.",
  "capital-staffing": "Podemos ayudarte con eso desde Capital Staffing: selección, gestión humana y desarrollo.",
  "capital-business-services": "Eso lo vemos en Capital Business Services: nómina, contabilidad, tributaria y laboral.",
}

function serviceIntroBlocks(service: ChatServiceKnowledge, alreadyActive: boolean): ChatBlock[] {
  if (alreadyActive) {
    return [
      { type: "text", text: `Sigamos con ${service.name}.` },
      { type: "text", text: service.followUpQuestion },
    ]
  }
  return [
    { type: "text", text: SERVICE_INTROS[service.id] ?? `Podemos ayudarte desde ${service.name}.` },
    toCard(service),
    { type: "text", text: service.followUpQuestion },
  ]
}

export function createInitialContext(): ChatContext {
  return {}
}

/** Procesa un mensaje del usuario y devuelve la respuesta + el contexto actualizado. */
export function processUserMessage(context: ChatContext, rawText: string): EngineReply {
  const trimmed = rawText.trim()
  if (!trimmed) {
    return { blocks: [], suggestions: suggestionsFor(context), context }
  }

  let workingContext: ChatContext = { ...context, lastUserMessage: trimmed }

  if (includesAny(normalize(trimmed), RESET_PHRASES)) {
    return {
      blocks: [],
      suggestions: DEFAULT_SUGGESTIONS,
      context: {},
    }
  }

  const namePrefix: ChatBlock[] = []
  const { name, rest } = extractName(trimmed)
  let workingText = rest
  if (name) {
    workingContext = { ...workingContext, name }
    namePrefix.push({ type: "text", text: `Mucho gusto, ${name}.` })
  }

  const normalizedText = normalize(workingText || trimmed)

  const industry = detectIndustry(normalizedText)
  if (industry) {
    workingContext = { ...workingContext, industry }
  }

  // Intenciones "duras" que pueden interrumpir cualquier flujo en curso.
  if (includesAny(normalizedText, ADVISOR_PHRASES)) {
    const reply = advisorBlocks(workingContext)
    return { blocks: [...namePrefix, ...reply], suggestions: [], context: { ...workingContext, pendingQuestion: undefined } }
  }

  if (includesAny(normalizedText, PQR_PHRASES)) {
    return {
      blocks: [
        ...namePrefix,
        {
          type: "text",
          text: "Para radicar una PQR tenemos un espacio dedicado donde tu solicitud queda registrada formalmente.",
        },
        { type: "link", label: "Ir a PQR", href: ROUTES.pqr },
      ],
      suggestions: DEFAULT_SUGGESTIONS,
      context: { ...workingContext, pendingQuestion: undefined },
    }
  }

  if (includesAny(normalizedText, CAREERS_PHRASES)) {
    return {
      blocks: [
        ...namePrefix,
        {
          type: "text",
          text: "¡Qué bueno que quieras sumarte al equipo! Postúlate directamente en nuestra sección de vacantes.",
        },
        { type: "link", label: "Trabaja con nosotros", href: ROUTES.careers },
      ],
      suggestions: DEFAULT_SUGGESTIONS,
      context: { ...workingContext, pendingQuestion: undefined },
    }
  }

  // Si hay una pregunta pendiente y el usuario no cambió de tema, respondemos en contexto. La
  // respuesta a esa pregunta suele repetir palabras clave del propio servicio activo (p. ej.
  // "vacante" respondiendo a la pregunta de Staffing), así que solo se considera "cambio de
  // tema" cuando el servicio detectado es distinto del que ya está activo en el contexto.
  const detectedService = detectService(normalizedText)
  if (
    workingContext.pendingQuestion &&
    (!detectedService || detectedService.id === workingContext.serviceId)
  ) {
    const reply = handlePendingQuestion(workingContext, normalizedText)
    return { blocks: [...namePrefix, ...reply.blocks], suggestions: reply.suggestions, context: reply.context }
  }

  const service = detectedService
  if (service) {
    const alreadyActive = workingContext.serviceId === service.id
    const blocks = serviceIntroBlocks(service, alreadyActive)
    return {
      blocks: [...namePrefix, ...blocks],
      suggestions: service.suggestions,
      context: { ...workingContext, serviceId: service.id, pendingQuestion: service.pendingKey },
    }
  }

  if (includesAny(normalizedText, SERVICES_OVERVIEW_PHRASES)) {
    return {
      blocks: [
        ...namePrefix,
        { type: "text", text: "Estas son nuestras líneas de servicio:" },
        ...CHAT_SERVICES.map((svc) => toCard(svc)),
        { type: "text", text: "Cuéntame qué necesitas resolver y te oriento hacia la que aplique." },
      ],
      suggestions: DEFAULT_SUGGESTIONS,
      context: { ...workingContext, pendingQuestion: undefined },
    }
  }

  // Si mencionó una industria reconocible (p. ej. transporte) sin pedir un servicio puntual.
  if (industry === "transporte" && !workingContext.serviceId) {
    const mobility = findServiceById("capital-mobility")!
    return {
      blocks: [
        ...namePrefix,
        {
          type: "text",
          text: "Como me comentas que trabajas en transporte, probablemente Capital Mobility sea especialmente relevante para tu caso.",
        },
        { type: "text", text: "¿Quieres que te cuente más o prefieres hablar con un asesor?" },
      ],
      suggestions: mobility.suggestions,
      context: { ...workingContext, serviceId: mobility.id, pendingQuestion: "offer_advisor" },
    }
  }

  if (namePrefix.length && !workingText) {
    // El mensaje solo presentaba el nombre — retomamos la pregunta pendiente o saludamos.
    return {
      blocks: [...namePrefix, { type: "text", text: pendingQuestionText(workingContext) }],
      suggestions: suggestionsFor(workingContext),
      context: workingContext,
    }
  }

  if (includesAny(normalizedText, GREETING_PHRASES) && normalizedText.length < 20) {
    return {
      blocks: [
        ...namePrefix,
        {
          type: "text",
          text: workingContext.name
            ? `¡Hola de nuevo, ${workingContext.name}! ¿En qué más puedo ayudarte?`
            : "¡Hola! ¿En qué puedo ayudarte hoy?",
        },
      ],
      suggestions: suggestionsFor(workingContext),
      context: workingContext,
    }
  }

  return {
    blocks: [
      ...namePrefix,
      { type: "text", text: "No estoy seguro de haber entendido tu necesidad." },
      {
        type: "text",
        text: "Puedes contarme, por ejemplo, qué problema quieres resolver, qué servicio buscas o con qué tipo de organización trabajas.",
      },
      { type: "text", text: "También puedo conectarte con un asesor." },
    ],
    suggestions: DEFAULT_SUGGESTIONS,
    context: workingContext,
  }
}
