/**
 * Helpers para construir metadata SEO consistente (canonical, Open Graph,
 * Twitter card) reutilizando `SITE`/`NAP` como fuente única de verdad —
 * evita repetir `metadataBase`, `og:site_name`, `summary_large_image`, etc.
 * en cada página. Brief SEO, secciones 14-16.
 */
import type { Metadata } from "next"
import { SITE } from "@/config/site"

/** URL canónica absoluta para una ruta pública (ej. "/servicios/capital-hse"). */
export function canonicalUrl(path: string): string {
  const normalized = path === "/" ? "" : path.replace(/\/+$/, "")
  return `${SITE.url}${normalized}`
}

export interface PageSeoInput {
  title: string
  description: string
  /** Ruta pública, ej. "/contacto". Se usa para `alternates.canonical` y `og:url`. */
  path: string
  /** Imagen para OG/Twitter; por defecto `SITE.defaultOgImage`. */
  image?: string
  /** "article" para blog/noticias, "website" para el resto (default). */
  type?: "website" | "article"
  publishedTime?: string
  authors?: string[]
}

/**
 * Construye los bloques `alternates`, `openGraph` y `twitter` comunes a
 * partir de un título/descripción ya definidos por la página. Se combinan
 * con `{ ...metadata, ...buildPageSeo(...) }` o extendiendo el objeto
 * `openGraph` puntual de cada página cuando necesite campos extra.
 */
export function buildPageSeo(input: PageSeoInput): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  const image = input.image ?? SITE.defaultOgImage
  const url = canonicalUrl(input.path)

  // El tipo `OpenGraph` de Next es una unión discriminada por `type`; como
  // aquí se arma dinámicamente (website | article) se castea al final en
  // vez de forzar a TypeScript a inferir la variante exacta.
  const openGraph = {
    title: input.title,
    description: input.description,
    url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: input.type ?? "website",
    images: [{ url: image }],
    ...(input.type === "article" && input.publishedTime
      ? { publishedTime: input.publishedTime }
      : {}),
    ...(input.type === "article" && input.authors ? { authors: input.authors } : {}),
  } as Metadata["openGraph"]

  return {
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  }
}
