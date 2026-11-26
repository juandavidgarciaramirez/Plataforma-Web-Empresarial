"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { api } from "@/lib/api/axios"
import { buildWhatsAppUrl, CONTACT } from "@/config/contact"
import { CHAT_SERVICES, DEFAULT_SUGGESTIONS, INITIAL_MESSAGES, findServiceById } from "@/config/chatbot"
import type { ChatBlock } from "@/lib/chatbot/engine"
import { trackEvent } from "@/lib/analytics/tracker"

/**
 * Motor de conversación de Yuri — conectado al backend real
 * (`POST /api/v1/chat/message`, ver `backend/src/modules/chat`). El backend
 * aplica las reglas de detección de intención y mantiene el contexto de
 * sesión; este hook solo administra el estado de la UI (historial, indicador
 * de escritura, persistencia local) y traduce la respuesta del API a los
 * mismos `ChatBlock` que ya sabe renderizar `ChatMessage` — sección 26-27
 * del brief ("mejorar únicamente la conexión", sin reemplazar el chat ni su
 * diseño).
 */

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  block: ChatBlock
  /** Muestra el avatar de la mascota junto a este mensaje (solo momentos clave). */
  withMascot?: boolean
  /** Se anima con efecto de escritura solo la primera vez que se renderiza en vivo. */
  fresh?: boolean
}

export interface ChatContext {
  name: string | null
  company: string | null
  email: string | null
  phone: string | null
  service: string | null
  intent: string | null
  industry: string | null
  need: string | null
  problem: string | null
}

/** Forma de `data` dentro del envelope `{ success, message, data }` que devuelve el backend. */
interface ChatApiReply {
  message: string
  assistant: string
  intent: string
  service: string | null
  suggestions: string[]
  escalateToHuman: boolean
  leadIntent: boolean
  channels: { whatsapp: { label: string; url: string }; email: { label: string; url: string } } | null
  link: { label: string; href: string } | null
  context: ChatContext
}

const STORAGE_KEY = "yuri-chat-session-v1"
const SESSION_ID_KEY = "yuri-chat-session-id"

let idCounter = 0
function nextId(): string {
  idCounter += 1
  return `msg-${Date.now()}-${idCounter}`
}

/** Campos oficiales del contexto: los mismos que declara `ChatContextDto` en el backend. */
const CONTEXT_KEYS = ["name", "company", "email", "phone", "service", "intent", "industry", "need", "problem"] as const satisfies ReadonlyArray<keyof ChatContext>

function createInitialContext(): ChatContext {
  return { name: null, company: null, email: null, phone: null, service: null, intent: null, industry: null, need: null, problem: null }
}

/**
 * Única forma de construir el contexto que se guarda y se reenvía al backend:
 * conserva solo los campos del contrato, como string o null. El backend valida
 * con `forbidNonWhitelisted`, así que cualquier propiedad extra (de una sesión
 * guardada por una versión anterior o de una respuesta inesperada) haría
 * fallar la siguiente petición con 400.
 */
function toChatContext(raw: unknown): ChatContext {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  const context = createInitialContext()
  for (const key of CONTEXT_KEYS) {
    const value = source[key]
    context[key] = typeof value === "string" && value.trim() ? value : null
  }
  return context
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server"
  const existing = window.sessionStorage.getItem(SESSION_ID_KEY)
  if (existing) return existing
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`
  window.sessionStorage.setItem(SESSION_ID_KEY, id)
  return id
}

function greetingMessages(): ChatMessage[] {
  return INITIAL_MESSAGES.map((text, index) => ({
    id: nextId(),
    role: "assistant",
    block: { type: "text", text },
    withMascot: index === 0,
    fresh: true,
  }))
}

interface StoredSession {
  messages: Array<Omit<ChatMessage, "fresh">>
  context: ChatContext
  suggestions: string[]
}

function isStoredMessage(value: unknown): value is Omit<ChatMessage, "fresh"> {
  if (!value || typeof value !== "object") return false
  const message = value as Partial<ChatMessage>
  return (
    typeof message.id === "string" &&
    (message.role === "user" || message.role === "assistant") &&
    !!message.block &&
    typeof message.block === "object" &&
    typeof message.block.type === "string"
  )
}

function isString(value: unknown): value is string {
  return typeof value === "string"
}

/** Restaura la sesión guardada tolerando formatos de versiones anteriores del chat. */
function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Record<keyof StoredSession, unknown>> | null
    if (!parsed || !Array.isArray(parsed.messages)) return null
    return {
      messages: parsed.messages.filter(isStoredMessage),
      context: toChatContext(parsed.context),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.filter(isString) : DEFAULT_SUGGESTIONS,
    }
  } catch {
    return null
  }
}

function saveSession(session: StoredSession) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // almacenamiento no disponible (modo privado, cuota, etc.) — no bloquea el chat.
  }
}

/** Construye los bloques de escalamiento a partir de los links que ya calculó el backend. */
function advisorBlockFrom(channels: NonNullable<ChatApiReply["channels"]>): ChatBlock {
  return { type: "advisor", whatsappUrl: channels.whatsapp.url, mailUrl: channels.email.url }
}

/** Fallback local (sin red) para cuando el backend no responde — igual mantiene una salida a un humano real. */
function offlineAdvisorBlock(): ChatBlock {
  return { type: "advisor", whatsappUrl: buildWhatsAppUrl(), mailUrl: `mailto:${CONTACT.emails.commercial}` }
}

class InvalidChatReplyError extends Error {}

/** Respuesta HTTP no exitosa del endpoint del chat, con su cuerpo para diagnosticar. */
class ChatHttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`HTTP ${status}`)
  }
}

/** Valida el `data` del envelope `{ success, data }`; una forma inesperada se trata como error, no como respuesta. */
function parseReply(payload: unknown): ChatApiReply {
  const data = (payload as { data?: unknown } | null)?.data as Partial<Record<keyof ChatApiReply, unknown>> | undefined
  if (!data || typeof data.message !== "string" || !data.message.trim()) {
    throw new InvalidChatReplyError("La respuesta de /chat/message no tiene el formato esperado.")
  }
  const channels = data.channels as ChatApiReply["channels"] | undefined
  const link = data.link as ChatApiReply["link"] | undefined
  return {
    message: data.message,
    assistant: typeof data.assistant === "string" ? data.assistant : "Yuri",
    intent: typeof data.intent === "string" ? data.intent : "unknown",
    service: typeof data.service === "string" ? data.service : null,
    suggestions: Array.isArray(data.suggestions) ? data.suggestions.filter(isString) : [],
    escalateToHuman: data.escalateToHuman === true,
    leadIntent: data.leadIntent === true,
    channels:
      channels && isString(channels.whatsapp?.url) && isString(channels.email?.url) ? channels : null,
    link: link && isString(link.href) && isString(link.label) ? link : null,
    context: toChatContext(data.context),
  }
}

type ChatFailureKind = "network" | "timeout" | "validation" | "auth" | "rate_limit" | "server" | "invalid_response"

interface ChatFailure {
  kind: ChatFailureKind
  status?: number
  /** Detalle técnico (estado HTTP y mensajes de validación). Solo se muestra en desarrollo. */
  detail?: string
}

function classifyFailure(error: unknown): ChatFailure {
  if (error instanceof InvalidChatReplyError) return { kind: "invalid_response", detail: error.message }
  if (axios.isAxiosError(error)) {
    const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
    return { kind: timedOut ? "timeout" : "network", detail: error.code ?? error.message }
  }
  if (!(error instanceof ChatHttpError)) return { kind: "server", detail: error instanceof Error ? error.message : String(error) }

  const { status } = error
  const body = error.body as { message?: unknown; errors?: unknown } | undefined
  const reasons = Array.isArray(body?.errors) ? body.errors.filter(isString).join("; ") : ""
  const detail = `HTTP ${status}${typeof body?.message === "string" ? ` — ${body.message}` : ""}${reasons ? `: ${reasons}` : ""}`

  if (status === 400 || status === 422) return { kind: "validation", status, detail }
  if (status === 401 || status === 403) return { kind: "auth", status, detail }
  if (status === 429) return { kind: "rate_limit", status, detail }
  return { kind: "server", status, detail }
}

const FAILURE_MESSAGES: Record<ChatFailureKind, string> = {
  network: "No pude conectarme con el servidor en este momento. Revisa tu conexión e inténtalo de nuevo, o escríbenos directamente.",
  timeout: "El servidor está tardando en responder. Inténtalo de nuevo en unos segundos o escríbenos directamente.",
  validation: "No pude procesar ese mensaje. Inténtalo de nuevo o escríbenos directamente.",
  auth: "No pude validar tu solicitud en este momento. Escríbenos directamente y con gusto te atendemos.",
  rate_limit: "Estás enviando mensajes muy rápido. Espera un momento y vuelve a intentarlo.",
  server: "Tuve un problema al procesar tu mensaje. Inténtalo de nuevo en un momento o escríbenos directamente.",
  invalid_response: "Tuve un problema al procesar tu mensaje. Inténtalo de nuevo en un momento o escríbenos directamente.",
}

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production"

/** Mensaje para el visitante; en desarrollo agrega el detalle técnico para diagnosticar. */
function failureText(failure: ChatFailure): string {
  const text = FAILURE_MESSAGES[failure.kind]
  return IS_DEVELOPMENT && failure.detail ? `${text} [dev: ${failure.detail}]` : text
}

/** Evita repetir los botones de contacto si el último mensaje de Yuri ya los mostraba. */
function dropRepeatedAdvisor(previous: ChatMessage[], blocks: ChatBlock[]): ChatBlock[] {
  const lastAssistant = [...previous].reverse().find((message) => message.role === "assistant")
  if (lastAssistant?.block.type !== "advisor") return blocks
  return blocks.filter((block) => block.type !== "advisor")
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
}

/** Variantes que disparan el listado de servicios. El backend (`ChatService.resolveOutcome`)
 * no tiene una intención dedicada para esto — un mensaje "Ver servicios" cae en su rama de
 * "no entendí" —, así que se resuelve aquí mismo, sin red: debe ser local e inmediato. */
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

function isServicesOverviewRequest(text: string): boolean {
  const normalized = normalize(text)
  return SERVICES_OVERVIEW_PHRASES.some((phrase) => normalized.includes(phrase))
}

/** Respuesta local (sin backend) con las líneas de servicio vigentes — misma fuente
 * (`CHAT_SERVICES`) que usa el backend para no listar nada que no exista realmente. */
function servicesOverviewBlocks(): ChatBlock[] {
  return [
    { type: "text", text: "Estas son nuestras líneas de servicio:" },
    ...CHAT_SERVICES.map(
      (service): ChatBlock => ({
        type: "card",
        service: { id: service.id, name: service.name, tagline: service.tagline, href: service.href },
      }),
    ),
    { type: "text", text: "Cuéntame qué necesitas resolver y te oriento hacia la que aplique." },
  ]
}

export function useChatEngine() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [context, setContext] = useState<ChatContext>(createInitialContext())
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS)
  const [isTyping, setIsTyping] = useState(false)
  const hydrated = useRef(false)
  const sessionIdRef = useRef<string>("")
  // Recuerda el último servicio ya mostrado como tarjeta para no repetirla en cada turno.
  const lastCardServiceRef = useRef<string | null>(null)
  // Un solo envío a la vez: Enter puede dispararse mientras Yuri aún responde.
  const inFlightRef = useRef(false)
  // Se incrementa al reiniciar: una respuesta de la conversación anterior se descarta.
  const conversationRef = useRef(0)
  // Analítica web (Etapa 15): inicio de conversación y de cotización se registran una vez por conversación.
  const chatStartedRef = useRef(false)
  const quoteStartedRef = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    sessionIdRef.current = getOrCreateSessionId()

    const stored = loadSession()
    if (stored && stored.messages.length > 0) {
      setMessages(stored.messages.map((m) => ({ ...m, fresh: false })))
      setContext(stored.context)
      setSuggestions(stored.suggestions)
      lastCardServiceRef.current = stored.context.service
      chatStartedRef.current = stored.messages.some((m) => m.role === "user")
    } else {
      const greeting = greetingMessages()
      setMessages(greeting)
      setSuggestions(DEFAULT_SUGGESTIONS)
    }
  }, [])

  useEffect(() => {
    if (!hydrated.current || messages.length === 0) return
    saveSession({ messages: messages.map(({ fresh: _fresh, ...rest }) => rest), context, suggestions })
  }, [messages, context, suggestions])

  const pushAssistantReply = useCallback((blocks: ChatBlock[]) => {
    if (blocks.length === 0) return
    const important = (block: ChatBlock) => block.type === "advisor" || block.type === "card"
    setMessages((prev) => [
      ...prev,
      ...blocks.map((block) => ({
        id: nextId(),
        role: "assistant" as const,
        block,
        withMascot: important(block),
        fresh: true,
      })),
    ])
  }, [])

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim()
      if (!text || inFlightRef.current) return

      setMessages((prev) => [...prev, { id: nextId(), role: "user", block: { type: "text", text } }])
      if (!chatStartedRef.current) {
        chatStartedRef.current = true
        trackEvent("yuri_chat_start")
      }

      // "Ver servicios" (y variantes) se resuelve localmente y de inmediato: no depende de que
      // el backend esté disponible para mostrar el portafolio.
      if (isServicesOverviewRequest(text)) {
        pushAssistantReply(servicesOverviewBlocks())
        setSuggestions(DEFAULT_SUGGESTIONS)
        lastCardServiceRef.current = null
        return
      }

      inFlightRef.current = true
      const conversation = conversationRef.current
      setIsTyping(true)

      try {
        const response = await api.post<unknown>(
          "/chat/message",
          { sessionId: sessionIdRef.current, message: text, context: toChatContext(context) },
          // Endpoint público: cualquier estado HTTP se resuelve aquí, sin pasar por el
          // refresh de token / redirección a /login que el interceptor aplica al panel admin.
          { validateStatus: () => true },
        )
        if (conversation !== conversationRef.current) return
        if (response.status < 200 || response.status >= 300) throw new ChatHttpError(response.status, response.data)
        const reply = parseReply(response.data)
        if (reply.intent === "quote") {
          if (!quoteStartedRef.current) {
            quoteStartedRef.current = true
            trackEvent("yuri_quote_start", { service: reply.service })
          }
          // `leadIntent` solo llega en true cuando el backend registró la cotización en el CRM.
          if (reply.leadIntent) {
            trackEvent("yuri_quote_complete", { service: reply.service })
            quoteStartedRef.current = false
          }
        }

        const blocks: ChatBlock[] = [{ type: "text", text: reply.message }]

        if (reply.service && reply.service !== lastCardServiceRef.current) {
          const service = findServiceById(reply.service)
          if (service) {
            blocks.push({ type: "card", service: { id: service.id, name: service.name, tagline: service.tagline, href: service.href } })
          }
        }
        lastCardServiceRef.current = reply.service

        if (reply.link) {
          blocks.push({ type: "link", label: reply.link.label, href: reply.link.href })
        }

        if (reply.escalateToHuman) {
          blocks.push(reply.channels ? advisorBlockFrom(reply.channels) : offlineAdvisorBlock())
        }

        pushAssistantReply(blocks)
        setSuggestions(reply.suggestions)
        setContext(reply.context)
      } catch (error) {
        if (conversation !== conversationRef.current) return
        // El contexto y las sugerencias no cambian: lo ya capturado sigue válido para reintentar.
        const failure = classifyFailure(error)
        if (IS_DEVELOPMENT) console.error("[Yuri] POST /chat/message falló:", failure)
        const blocks: ChatBlock[] = [{ type: "text", text: failureText(failure) }]
        if (failure.kind !== "rate_limit" && failure.kind !== "validation") blocks.push(offlineAdvisorBlock())
        setMessages((prev) => [
          ...prev,
          ...dropRepeatedAdvisor(prev, blocks).map((block) => ({
            id: nextId(),
            role: "assistant" as const,
            block,
            withMascot: block.type === "advisor",
            fresh: true,
          })),
        ])
      } finally {
        if (conversation === conversationRef.current) {
          inFlightRef.current = false
          setIsTyping(false)
        }
      }
    },
    [context, pushAssistantReply],
  )

  const resetConversation = useCallback(() => {
    conversationRef.current += 1
    inFlightRef.current = false
    setIsTyping(false)
    const newContext = createInitialContext()
    setContext(newContext)
    setSuggestions(DEFAULT_SUGGESTIONS)
    setMessages(greetingMessages())
    lastCardServiceRef.current = null
    chatStartedRef.current = false
    quoteStartedRef.current = false
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY)
      window.sessionStorage.removeItem(SESSION_ID_KEY)
      sessionIdRef.current = getOrCreateSessionId()
    }
  }, [])

  return { messages, context, suggestions, isTyping, sendMessage, resetConversation }
}
