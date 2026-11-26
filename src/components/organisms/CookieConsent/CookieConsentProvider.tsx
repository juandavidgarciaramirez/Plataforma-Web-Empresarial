"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { CookieConsentPreferences, CookieConsentState } from "@/config/legal"
import {
  ALL_COOKIES_ACCEPTED,
  ONLY_NECESSARY_COOKIES,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookies/cookie-consent"

interface CookieConsentContextValue {
  /** Decisión guardada. `null` mientras no se sabe (SSR) o si el usuario aún no ha decidido. */
  state: CookieConsentState | null
  /** El banner solo debe mostrarse tras hidratar en cliente y si no hay una decisión válida guardada. */
  showBanner: boolean
  isPreferencesOpen: boolean
  openPreferences: () => void
  closePreferences: () => void
  acceptAll: () => void
  rejectAll: () => void
  savePreferences: (preferences: CookieConsentPreferences) => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

/**
 * Provee el estado de consentimiento de cookies a toda la web pública:
 * el banner (sección 9), el panel de preferencias (sección 12) y el enlace
 * "Preferencias de cookies" del Footer (sección 15) comparten esta misma
 * instancia de contexto.
 */
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CookieConsentState | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [isPreferencesOpen, setPreferencesOpen] = useState(false)

  useEffect(() => {
    setState(readCookieConsent())
    setHydrated(true)
  }, [])

  const persist = useCallback((preferences: CookieConsentPreferences) => {
    setState(writeCookieConsent(preferences))
    setPreferencesOpen(false)
  }, [])

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      state,
      showBanner: hydrated && state === null,
      isPreferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      acceptAll: () => persist(ALL_COOKIES_ACCEPTED),
      rejectAll: () => persist(ONLY_NECESSARY_COOKIES),
      savePreferences: persist,
    }),
    [state, hydrated, isPreferencesOpen, persist]
  )

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    throw new Error("useCookieConsent debe usarse dentro de <CookieConsentProvider>")
  }
  return ctx
}
