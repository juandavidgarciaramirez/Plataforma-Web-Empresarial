import { WhatsAppAssistant } from "@/components/organisms/WhatsAppAssistant/WhatsAppAssistant"
import { CookieConsentProvider, CookieBanner, CookiePreferences } from "@/components/organisms/CookieConsent"
import { AnalyticsTracker } from "@/lib/analytics/AnalyticsTracker"

/**
 * Layout del grupo `(public)`: no envuelve nada visualmente (cada página ya
 * arma su propio `<Navbar/><main/><Footer/>`), solo agrega el asistente
 * flotante de WhatsApp y el sistema de consentimiento de cookies una única
 * vez para que queden presentes en todas las páginas públicas sin tener que
 * tocar cada página existente.
 *
 * `CookieConsentProvider` envuelve `children` (no solo el banner) a
 * propósito: el Footer vive dentro de `children` y necesita el mismo
 * contexto para el enlace "Preferencias de cookies" (sección 15 del brief).
 *
 * `AnalyticsTracker` (Etapa 15) vive solo aquí: las rutas del panel y de
 * autenticación quedan fuera de la medición por construcción.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      {children}
      <WhatsAppAssistant />
      <CookieBanner />
      <CookiePreferences />
      <AnalyticsTracker />
    </CookieConsentProvider>
  )
}
