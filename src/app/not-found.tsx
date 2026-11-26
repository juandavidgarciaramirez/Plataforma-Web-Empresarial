import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { WhatsAppAssistant } from "@/components/organisms/WhatsAppAssistant/WhatsAppAssistant"
import { CookieConsentProvider, CookieBanner, CookiePreferences } from "@/components/organisms/CookieConsent"
import { Button } from "@/components/atoms/Button"

/**
 * Página 404 (brief SEO sección 28). Vive en `src/app/not-found.tsx` (fuera
 * del grupo `(public)`) para capturar cualquier URL sin coincidencia en todo
 * el sitio, así que arma su propio Navbar/Footer/Yuri en vez de depender del
 * layout de `(public)`.
 */
export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    // `CookieConsentProvider` envuelve todo porque `Footer` (enlace
    // "Preferencias de cookies") y `CookieBanner`/`CookiePreferences`
    // necesitan ese contexto — fuera del grupo `(public)` no lo heredan
    // automáticamente de `(public)/layout.tsx`.
    <CookieConsentProvider>
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
        <span className="font-display text-7xl font-bold text-primary">404</span>
        <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">
          No encontramos esta página.
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          La página que buscas no existe, cambió de dirección o ya no está disponible.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#servicios">Explorar servicios</Link>
          </Button>
        </div>
      </main>
      <Footer />
      <WhatsAppAssistant />
      <CookieBanner />
      <CookiePreferences />
    </CookieConsentProvider>
  )
}
