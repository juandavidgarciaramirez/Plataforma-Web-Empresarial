import type { MetadataRoute } from "next"
import { SITE_URL } from "@/config/site"

/**
 * sitemap.xml estático para las rutas públicas principales.
 *
 * Se mantiene independiente del backend durante el build de Vercel
 * para evitar que una caída de la API impida desplegar el sitio.
 *
 * No incluye Admin/CRM/Login/API ni páginas privadas.
 */

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  {
    path: "/servicios/capital-hse",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/servicios/capital-mobility",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/servicios/capital-learning",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/servicios/capital-staffing",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/servicios/capital-business-services",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/about",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/blog",
    changeFrequency: "daily" as const,
    priority: 0.6,
  },
  {
    path: "/noticias",
    changeFrequency: "daily" as const,
    priority: 0.6,
  },
  {
    path: "/contacto",
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    path: "/pqr",
    changeFrequency: "yearly" as const,
    priority: 0.4,
  },
  {
    path: "/trabaja-con-nosotros",
    changeFrequency: "weekly" as const,
    priority: 0.5,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}