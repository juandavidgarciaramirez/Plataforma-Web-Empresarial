import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  DEFAULT_COOKIE_PREFERENCES,
  type CookieConsentPreferences,
  type CookieConsentState,
} from "@/config/legal"

/**
 * Lee la decisión de cookies guardada en `localStorage`. Devuelve `null`
 * cuando no existe, cuando el navegador no tiene `localStorage` disponible
 * (SSR, modo privado) o cuando la versión guardada quedó desactualizada —
 * en ese caso el llamador debe volver a solicitar el consentimiento
 * (sección 26 del brief).
 */
export function readCookieConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<CookieConsentState>
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null
    if (typeof parsed.timestamp !== "string") return null

    return {
      necessary: true,
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      version: parsed.version,
      timestamp: parsed.timestamp,
    }
  } catch {
    return null
  }
}

/** Persiste la decisión del usuario. No lanza si `localStorage` no está disponible. */
export function writeCookieConsent(preferences: CookieConsentPreferences): CookieConsentState {
  const state: CookieConsentState = {
    necessary: true,
    ...preferences,
    version: COOKIE_CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  }

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(state))
    }
  } catch {
    // Almacenamiento no disponible (modo privado, cuotas, etc.) — la sesión
    // simplemente volverá a preguntar en la próxima visita.
  }

  return state
}

export const ALL_COOKIES_ACCEPTED: CookieConsentPreferences = {
  preferences: true,
  analytics: true,
  marketing: true,
}

export const ONLY_NECESSARY_COOKIES: CookieConsentPreferences = DEFAULT_COOKIE_PREFERENCES
