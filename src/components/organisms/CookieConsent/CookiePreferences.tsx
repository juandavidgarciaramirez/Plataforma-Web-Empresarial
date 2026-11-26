"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/atoms/Button"
import { COOKIE_CATEGORIES, DEFAULT_COOKIE_PREFERENCES, type CookieConsentPreferences } from "@/config/legal"
import { ALL_COOKIES_ACCEPTED, ONLY_NECESSARY_COOKIES } from "@/lib/cookies/cookie-consent"
import { useCookieConsent } from "./CookieConsentProvider"

/**
 * Panel de configuración de cookies (sección 12 del brief). Se abre desde el
 * banner ("Configurar cookies"), desde el Footer ("Preferencias de cookies")
 * o programáticamente vía `useCookieConsent().openPreferences()`.
 */
export function CookiePreferences() {
  const { state, isPreferencesOpen, closePreferences, savePreferences } = useCookieConsent()

  const [draft, setDraft] = useState<CookieConsentPreferences>(DEFAULT_COOKIE_PREFERENCES)

  // Cada vez que se abre el panel, parte de la decisión guardada (o de "solo
  // necesarias" si aún no hay ninguna) en lugar de arrastrar cambios sin
  // guardar de una apertura anterior.
  useEffect(() => {
    if (isPreferencesOpen) {
      setDraft({
        preferences: state?.preferences ?? false,
        analytics: state?.analytics ?? false,
        marketing: state?.marketing ?? false,
      })
    }
  }, [isPreferencesOpen, state])

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferencias de cookies</DialogTitle>
          <DialogDescription>
            Elige qué categorías de cookies quieres permitir. Las necesarias siempre están activas porque el sitio
            no funciona correctamente sin ellas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {COOKIE_CATEGORIES.map((category) => {
            const checked = category.required ? true : draft[category.id as keyof CookieConsentPreferences]
            return (
              <div
                key={category.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border/50 p-4"
              >
                <div>
                  <Label htmlFor={`cookie-${category.id}`} className="text-sm font-semibold text-foreground">
                    {category.name}
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                  {category.required && (
                    <span className="mt-1 inline-block text-xs font-medium uppercase tracking-wide text-primary">
                      Siempre activas
                    </span>
                  )}
                </div>
                <Switch
                  id={`cookie-${category.id}`}
                  checked={checked}
                  disabled={category.required}
                  onCheckedChange={(value) =>
                    setDraft((prev) => ({ ...prev, [category.id]: value }) as CookieConsentPreferences)
                  }
                  aria-label={`Cookies ${category.name}`}
                />
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => savePreferences(ONLY_NECESSARY_COOKIES)}>
            Rechazar opcionales
          </Button>
          <Button type="button" variant="outline" onClick={() => savePreferences(ALL_COOKIES_ACCEPTED)}>
            Aceptar todas
          </Button>
          <Button type="button" variant="corporate" onClick={() => savePreferences(draft)}>
            Guardar preferencias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
