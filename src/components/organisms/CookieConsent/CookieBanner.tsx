"use client"

import { Cookie } from "lucide-react"
import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import { LEGAL_ROUTES } from "@/config/legal"
import { useCookieConsent } from "./CookieConsentProvider"

/**
 * Banner de cookies (secciones 8-10, 14 y 22-23 del brief). Aparece en la
 * primera visita, en la parte inferior de la pantalla, sin bloquear la
 * navegación.
 *
 * Posicionamiento: se muestra como una tarjeta compacta anclada abajo a la
 * izquierda en escritorio (`md:max-w-sm`) y elevada por encima del botón de
 * Yuri en móvil (`bottom-24`), para nunca superponerse con el asistente
 * flotante sin tener que modificar `WhatsAppAssistant` (Yuri vive en la
 * esquina inferior derecha con z-[60] — sección 22 del brief).
 */
export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent()

  if (!showBanner) return null

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-md sm:inset-x-6 md:inset-x-auto md:bottom-6 md:left-6 md:right-auto md:mx-0 md:max-w-sm"
    >
      <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-2xl dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground">Utilizamos cookies</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del sitio y
              fortalecer la seguridad de nuestros canales digitales. Consulta nuestra{" "}
              <Link href={LEGAL_ROUTES.dataPolicyUrl} className="font-medium text-primary hover:underline">
                Política de Tratamiento de Datos
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="corporate" size="sm" onClick={acceptAll}>
            Aceptar cookies
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={rejectAll}>
            Rechazar
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={openPreferences}>
            Configurar cookies
          </Button>
        </div>
      </div>
    </div>
  )
}
