/**
 * Fuente única de verdad para metadata SEO/GEO global del sitio: marca,
 * descripción base, URL canónica, imagen social por defecto y NAP
 * (Name/Address/Phone) de Capital Consulting and Services S.A.S.
 *
 * Nada debe hardcodear estos valores en otro lugar (Footer, JSON-LD,
 * metadata de páginas) — brief SEO+GEO, secciones 1, 17-21.
 *
 * Para emails/WhatsApp sigue usándose `@/config/contact` (CONTACT); este
 * archivo reexporta lo necesario para no duplicar esa fuente.
 */
import { CONTACT } from "./contact"

/**
 * URL pública del sitio, configurable por entorno (sección 14 del brief:
 * "dominio oficial configurado mediante environment"). En desarrollo local
 * cae a localhost; en producción debe apuntar al dominio oficial.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.capitalconsulting.com.co"
).replace(/\/$/, "")

export const SITE = {
  /** Nombre corto de marca, usado en el title template y og:site_name. */
  name: "Capital Consulting",
  /** Razón social completa, para JSON-LD y textos formales. */
  legalName: "Capital Consulting and Services S.A.S.",
  /**
   * Descripción base de la compañía (sección 1 del brief). No inventar
   * servicios que Capital no ofrece; reutilizar tal cual donde se necesite
   * una descripción genérica de marca.
   */
  description:
    "Consultoría empresarial, Seguridad y Salud en el Trabajo, Seguridad Vial, Gestión Humana, Formación y Soluciones Empresariales para organizaciones.",
  url: SITE_URL,
  /** Template de title para todas las páginas salvo la Home (sección 2). */
  titleTemplate: "%s | Capital Consulting",
  /** Título independiente y más fuerte para la Home (sección 3). */
  homeTitle: "Capital Consulting | Soluciones que impulsan tu empresa",
  homeDescription:
    "Capital Consulting acompaña a las organizaciones en Seguridad y Salud en el Trabajo, Seguridad Vial, Gestión Humana, Formación y soluciones empresariales.",
  /**
   * Imagen social por defecto (Open Graph / Twitter) cuando una página no
   * define la suya propia. No existe todavía un social-card dedicado de
   * 1200x630 — se usa el logo como fallback pragmático (ver docs/seo.md).
   */
  defaultOgImage: "/images/logo.png",
  locale: "es_CO",
} as const

/**
 * NAP (Name/Address/Phone) oficial y confirmado de Capital Consulting —
 * sección 19 del brief. No inventar barrios, coordenadas ni sucursales:
 * solo se usa la información empresarial confirmada.
 */
export const NAP = {
  legalName: SITE.legalName,
  nit: "902077689-7",
  /** Dirección oficial, formato consistente en todo el sitio. */
  streetAddress: "Carrera 73 G No. 60 A - 52",
  addressLocality: "Bogotá D.C.",
  addressRegion: "Bogotá D.C.",
  addressCountry: "CO",
  /** Texto de dirección listo para mostrar (Footer, Contacto, JSON-LD). */
  fullAddress: "Carrera 73 G No. 60 A - 52, Bogotá D.C., Colombia",
  /** Todos los teléfonos públicos de atención (Footer). El primero es el principal (JSON-LD, `telephone`). */
  phones: ["311 863 6746", "311 836 4572", "311 836 9245"] as const,
  get phone() {
    return this.phones[0]
  },
  email: CONTACT.emails.commercial,
} as const
