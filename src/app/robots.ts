import type { MetadataRoute } from "next"
import { SITE_URL } from "@/config/site"

/**
 * `robots.txt` dinámico (convención App Router). Permite indexar toda la
 * superficie pública (Home, Servicios, Nosotros, Blog, Noticias, Contacto,
 * PQR, Careers) y bloquea las rutas privadas/administrativas — brief SEO
 * sección 12. El CRM vive íntegramente bajo `/admin/crm/**`, así que
 * bloquear `/admin/` ya lo cubre. No bloquea assets (`_next`, imágenes)
 * necesarios para el renderizado.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/forgot-password", "/reset-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
