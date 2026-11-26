"use client"

import { useCookieConsent } from "./CookieConsentProvider"

/**
 * Enlace "Preferencias de cookies" del Footer (sección 15 del brief). Es el
 * único trozo interactivo que el Footer (server component) necesita para
 * volver a abrir el panel de preferencias — reutiliza el mismo contexto que
 * el banner porque `CookieConsentProvider` envuelve a `children` en
 * `(public)/layout.tsx`, y el Footer se renderiza dentro de esos `children`.
 */
export function CookiePreferencesLink({ className }: { className?: string }) {
  const { openPreferences } = useCookieConsent()

  return (
    <button type="button" onClick={openPreferences} className={className}>
      Preferencias de cookies
    </button>
  )
}
