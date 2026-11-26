import { SITE, NAP } from "@/config/site"

/**
 * JSON-LD `Organization` (brief SEO/GEO, secciones 17 y 20). Se usa
 * `Organization`, no `LocalBusiness`: Capital Consulting es una consultora
 * B2B, no un negocio físico de atención al público, así que declarar
 * `LocalBusiness` sería sobre-declarar frente a la actividad real. No
 * incluye ratings/reviews ni horarios — no existen datos reales de eso.
 *
 * Server Component puro: no necesita "use client", se renderiza una vez en
 * el layout raíz.
 */
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}${SITE.defaultOgImage}`,
    email: NAP.email,
    telephone: `+57${NAP.phone.replace(/\s/g, "")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: NAP.streetAddress,
      addressLocality: NAP.addressLocality,
      addressRegion: NAP.addressRegion,
      addressCountry: NAP.addressCountry,
    },
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
