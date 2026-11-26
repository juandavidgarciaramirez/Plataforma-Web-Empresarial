/**
 * Fuente única de verdad para las rutas legales del sitio y la configuración
 * del sistema de consentimiento de cookies. Nada debe hardcodear estas rutas
 * o claves en otro componente — secciones 28-29 del brief legal.
 */

export const LEGAL_ROUTES = {
  privacyUrl: "/politica-privacidad",
  dataPolicyUrl: "/politica-tratamiento-datos",
  termsUrl: "/terminos-y-condiciones",
} as const

/**
 * Categorías de cookies mostradas en el panel de preferencias (sección 11
 * del brief). `necessary` siempre está activa y no se puede desactivar; las
 * demás son opcionales e independientes entre sí.
 */
export const COOKIE_CATEGORIES = [
  {
    id: "necessary",
    name: "Necesarias",
    description:
      "Permiten la navegación y el funcionamiento básico del sitio. No pueden desactivarse porque el sitio no funcionaría correctamente sin ellas.",
    required: true,
  },
  {
    id: "preferences",
    name: "Preferencias",
    description: "Permiten recordar configuraciones del usuario, como el idioma o preferencias de visualización.",
    required: false,
  },
  {
    id: "analytics",
    name: "Analíticas",
    description: "Ayudan a conocer cómo se utiliza el sitio para mejorar la experiencia de navegación.",
    required: false,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Permiten personalizar determinados contenidos o comunicaciones cuando corresponda.",
    required: false,
  },
] as const

export type CookieCategoryId = (typeof COOKIE_CATEGORIES)[number]["id"]

/** Preferencias de cookies otorgadas por el usuario, persistidas en el navegador. */
export type CookieConsentPreferences = Record<Exclude<CookieCategoryId, "necessary">, boolean>

export interface CookieConsentState extends CookieConsentPreferences {
  necessary: true
  /** Versión de la configuración de cookies aceptada (ver `COOKIE_CONSENT_VERSION`). */
  version: string
  /** Fecha/hora ISO en que se guardó la decisión. */
  timestamp: string
}

/** Clave de `localStorage` donde se guarda la decisión del usuario. */
export const COOKIE_CONSENT_STORAGE_KEY = "cc_cookie_consent"

/**
 * Versión de la configuración de cookies. Si esta política cambia de forma
 * sustancial, súbela: cualquier consentimiento guardado con una versión
 * anterior se considera inválido y el banner vuelve a mostrarse (sección 26
 * del brief).
 */
export const COOKIE_CONSENT_VERSION = "1.0"

export const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  preferences: false,
  analytics: false,
  marketing: false,
}
