import { readCookieConsent } from "@/lib/cookies/cookie-consent"

/**
 * Analítica web propia (Etapa 15) — medición del sitio público hacia
 * `POST /analytics/collect` del backend. Decisiones de privacidad (ver
 * docs/media-y-analitica.md):
 *
 * - Con consentimiento de cookies "Analíticas": se guarda en `localStorage`
 *   un id de visitante aleatorio (UUID, seudónimo) y un id de sesión que
 *   rota tras 30 minutos de inactividad o al llegar con una campaña nueva.
 * - Mientras no haya decidido: solo se envían páginas vistas y eventos SIN
 *   ningún identificador ni almacenamiento en el navegador; cuentan en páginas
 *   vistas y visitas, no en visitantes.
 * - Si rechaza la medición ("Rechazar", analíticas desactivadas en sus
 *   preferencias, Do Not Track o Global Privacy Control): no se envía NADA y se
 *   borran los identificadores que hubiera.
 * - Nunca se envía la query string, el referente completo, ni contenido de
 *   formularios, correos, teléfonos o nombres: solo la ruta, el host de
 *   origen, los parámetros UTM y propiedades cortas de la lista blanca.
 * - Desactivada en desarrollo (salvo NEXT_PUBLIC_ANALYTICS_ENABLED=true), para
 *   navegadores automatizados y para quien usó el panel administrativo en
 *   este navegador (tráfico interno).
 */

export type AnalyticsEventName =
  | "whatsapp_click"
  | "email_click"
  | "contact_form_submit"
  | "pqr_submit"
  | "yuri_chat_start"
  | "yuri_quote_start"
  | "yuri_quote_complete"
  | "vacancy_click"
  | "application_submit"
  | "service_click"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
const ENDPOINT = `${API_BASE_URL}/analytics/collect`

const VISITOR_KEY = "cc_an_vid"
const SESSION_KEY = "cc_an_session"
const INTERNAL_KEY = "cc_an_internal"
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const MAX_BATCH = 20
const FLUSH_DELAY_MS = 1500
const PAID_CLICK_PARAMS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "li_fat_id"]
const PROP_VALUE = /^[a-z0-9/][a-z0-9_\-/.]{0,79}$/i

interface Attribution {
  referrerHost?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  paidClick?: boolean
}

interface StoredSession {
  id: string
  last: number
  attribution: Attribution
}

interface QueuedEvent {
  type: "pageview" | "event" | "ping"
  name?: AnalyticsEventName
  path: string
  visitorId?: string
  sessionId?: string
  entrance?: boolean
  attribution?: Attribution
  props?: Record<string, string>
  queuedAt: number
}

let queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null
let lastPageviewPath: string | null = null
let pageviewsThisLoad = 0
let loadAttribution: Attribution | null = null

/** Marca este navegador como tráfico interno (se llama desde el layout del panel administrativo). */
export function markInternalTraffic(): void {
  try {
    window.localStorage.setItem(INTERNAL_KEY, "1")
  } catch {
    // almacenamiento no disponible: no bloquea el panel.
  }
}

/** El visitante rechazó la medición: decisión guardada sin analíticas o señal de "no rastrear" del navegador. */
function measurementRefused(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  if (nav.globalPrivacyControl === true || nav.doNotTrack === "1") return true
  const consent = readCookieConsent()
  return consent !== null && !consent.analytics
}

function enabled(): boolean {
  if (typeof window === "undefined") return false
  const flag = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
  if (flag === "false") return false
  if (process.env.NODE_ENV !== "production" && flag !== "true") return false
  if (navigator.webdriver) return false
  if (measurementRefused()) {
    clearIdentifiers()
    return false
  }
  try {
    if (window.localStorage.getItem(INTERNAL_KEY) === "1") return false
  } catch {
    // sin almacenamiento: se mide igual, sin identificadores.
  }
  return true
}

/** Identificadores solo con consentimiento analítico explícito. */
function identifiersAllowed(): boolean {
  return readCookieConsent()?.analytics === true
}

function clearIdentifiers(): void {
  try {
    window.localStorage.removeItem(VISITOR_KEY)
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // nada que limpiar.
  }
}

function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function clip(value: string | null, max: number): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed.slice(0, max) : undefined
}

/** Origen de la llegada actual: host del referente externo + UTM (los valores de gclid/fbclid no se envían). */
function readLoadAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search)
  let referrerHost: string | undefined
  try {
    const host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ""
    if (host && host !== window.location.hostname.toLowerCase()) referrerHost = host.slice(0, 200)
  } catch {
    referrerHost = undefined
  }
  const attribution: Attribution = {
    referrerHost,
    utmSource: clip(params.get("utm_source"), 100),
    utmMedium: clip(params.get("utm_medium"), 100),
    utmCampaign: clip(params.get("utm_campaign"), 150),
    utmTerm: clip(params.get("utm_term"), 150),
    utmContent: clip(params.get("utm_content"), 150),
  }
  if (PAID_CLICK_PARAMS.some((param) => params.has(param))) attribution.paidClick = true
  return attribution
}

function hasCampaign(a: Attribution): boolean {
  return Boolean(a.utmSource || a.utmMedium || a.utmCampaign || a.paidClick)
}

function sameCampaign(a: Attribution, b: Attribution | undefined): boolean {
  return Boolean(b) && a.utmSource === b!.utmSource && a.utmMedium === b!.utmMedium && a.utmCampaign === b!.utmCampaign
}

/** La navegación actual es una recarga o un "atrás/adelante": no es una llegada nueva al sitio. */
function isReloadOrHistory(): boolean {
  const entry = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined
  return entry?.type === "reload" || entry?.type === "back_forward"
}

interface Identity {
  visitorId: string
  sessionId: string
  sessionIsNew: boolean
  attribution: Attribution
}

/** Sesión seudónima (solo con consentimiento): nueva tras 30 min de inactividad o con una campaña distinta. */
function resolveIdentity(now: number, landing: Attribution | null): Identity | null {
  if (!identifiersAllowed()) {
    clearIdentifiers()
    return null
  }
  try {
    let visitorId = window.localStorage.getItem(VISITOR_KEY)
    if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
      visitorId = uuid()
      window.localStorage.setItem(VISITOR_KEY, visitorId)
    }
    let stored: StoredSession | null = null
    try {
      stored = JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null") as StoredSession | null
    } catch {
      stored = null
    }
    const expired = !stored || typeof stored.last !== "number" || now - stored.last > SESSION_TIMEOUT_MS
    const campaignChanged = Boolean(landing && hasCampaign(landing) && !sameCampaign(landing, stored?.attribution))
    const sessionIsNew = expired || campaignChanged
    const session: StoredSession = sessionIsNew
      ? { id: uuid(), last: now, attribution: landing ?? loadAttribution ?? {} }
      : { ...stored!, last: now }
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { visitorId, sessionId: session.id, sessionIsNew, attribution: session.attribution }
  } catch {
    return null
  }
}

function send(events: QueuedEvent[]): void {
  const now = Date.now()
  const body = JSON.stringify({
    events: events.map(({ queuedAt, ...event }) => ({ ...event, ageMs: Math.max(0, now - queuedAt) })),
  })
  // text/plain = petición "simple" (sin preflight CORS); keepalive permite enviar al cerrar la pestaña.
  fetch(ENDPOINT, {
    method: "POST",
    body,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    keepalive: true,
    credentials: "omit",
    mode: "cors",
  }).catch(() => {
    // La analítica nunca debe afectar la navegación.
  })
}

export function flushAnalytics(): void {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
  // Rechazó mientras había eventos en cola (se envían con 1,5 s de retraso): no salen.
  if (measurementRefused()) {
    queue = []
    return
  }
  while (queue.length > 0) send(queue.splice(0, MAX_BATCH))
}

function enqueue(event: QueuedEvent): void {
  queue.push(event)
  if (queue.length >= MAX_BATCH) {
    flushAnalytics()
    return
  }
  if (!flushTimer) flushTimer = setTimeout(flushAnalytics, FLUSH_DELAY_MS)
}

/**
 * Página vista. Idempotente para la misma ruta consecutiva: los efectos
 * duplicados de React (StrictMode, re-renders) no generan registros extra.
 */
export function trackPageview(path: string): void {
  if (!enabled() || path === lastPageviewPath) return
  lastPageviewPath = path

  const now = Date.now()
  const firstOfLoad = pageviewsThisLoad === 0
  pageviewsThisLoad += 1
  if (firstOfLoad) loadAttribution = readLoadAttribution()

  const identity = resolveIdentity(now, firstOfLoad ? loadAttribution : null)
  const arrivedFromOutside = firstOfLoad && !isReloadOrHistory()
  const entrance = identity ? identity.sessionIsNew && arrivedFromOutside : arrivedFromOutside

  enqueue({
    type: "pageview",
    path,
    visitorId: identity?.visitorId,
    sessionId: identity?.sessionId,
    entrance,
    attribution: identity?.attribution ?? loadAttribution ?? undefined,
    queuedAt: now,
  })
}

/** Acción del visitante. Solo propiedades cortas tipo identificador (slug, ruta, categoría). */
export function trackEvent(name: AnalyticsEventName, props: Record<string, string | null | undefined> = {}): void {
  if (!enabled()) return
  const now = Date.now()
  const identity = resolveIdentity(now, null)
  const clean: Record<string, string> = {}
  for (const [key, value] of Object.entries(props)) {
    const text = value?.slice(0, 80)
    if (text && PROP_VALUE.test(text)) clean[key] = text
  }
  enqueue({
    type: "event",
    name,
    path: window.location.pathname,
    visitorId: identity?.visitorId,
    sessionId: identity?.sessionId,
    attribution: identity?.attribution ?? loadAttribution ?? undefined,
    props: clean,
    queuedAt: now,
  })
}

/** Pestaña oculta o cerrada: registra la última actividad de la sesión (duración) y vacía la cola. */
export function trackExit(): void {
  if (!enabled()) return
  if (identifiersAllowed()) {
    try {
      const stored = JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null") as StoredSession | null
      const visitorId = window.localStorage.getItem(VISITOR_KEY)
      if (stored && visitorId && Date.now() - stored.last <= SESSION_TIMEOUT_MS) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify({ ...stored, last: Date.now() }))
        queue.push({ type: "ping", path: window.location.pathname, visitorId, sessionId: stored.id, queuedAt: Date.now() })
      }
    } catch {
      // sin almacenamiento: no hay sesión que extender.
    }
  }
  flushAnalytics()
}
