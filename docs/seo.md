# SEO + GEO — Capital Consulting and Services S.A.S.

> Estado al 2026-09-07. Documenta lo que ya existía en el repo antes de esta
> tarea (auditado, no reescrito) y lo que se agregó para cerrar los gaps del
> brief SEO+GEO+Seguridad. Fuente única de verdad de código:
> [`src/config/site.ts`](../src/config/site.ts).

## 1. Fuente única de verdad

- **`src/config/site.ts`** — `SITE` (marca, descripción base, título de
  Home, template de título, imagen social por defecto) y `NAP`
  (Name/Address/Phone: razón social, NIT, dirección, teléfonos, email).
- **`src/config/contact.ts`** — emails por flujo (PQR/Careers/comercial) y
  WhatsApp. `NAP.email` lo reexporta desde aquí para no duplicar la fuente.
- **`src/lib/seo/metadata.ts`** — helpers `canonicalUrl(path)` y
  `buildPageSeo({ title, description, path, image?, type?, publishedTime?,
  authors? })` que arman `alternates.canonical` + `openGraph` + `twitter`
  consistentes. Se usa en todas las páginas nuevas/actualizadas.

Nada debe volver a hardcodear el dominio, el NAP o las imágenes sociales por
fuera de estos archivos.

## 2. Metadata global (`src/app/layout.tsx`)

- `metadataBase` desde `NEXT_PUBLIC_SITE_URL` (default
  `https://www.capitalconsulting.com.co`; en local, definir la variable a
  `http://localhost:3000` en `.env` — ver `.env.example`).
- `title.template = "%s | Capital Consulting"`, con `default` = el título
  fuerte de Home (brief, secciones 2-3).
- `robots` por defecto `index: true, follow: true` — páginas concretas
  (legales en borrador) lo sobreescriben cuando corresponde.
- `openGraph`/`twitter` (`summary_large_image`) globales, usados como
  fallback por cualquier página que no defina los suyos.
- JSON-LD `Organization` (`src/components/seo/OrganizationJsonLd.tsx`),
  montado una vez en el layout raíz.

## 3. Home

`src/app/(public)/page.tsx` era un Client Component (`"use client"`, usa
`useScrollReveal`/framer-motion), y **un Client Component no puede exportar
`metadata`** — de ahí que la Home solo heredara el título genérico del
layout. Se separó en:

- `page.tsx` (Server Component) — exporta `metadata` con el título/
  descripción exactos del brief (sección 3) + `buildPageSeo(...)`.
- `HomeContent.tsx` (Client Component) — el mismo cuerpo interactivo, sin
  cambios de comportamiento ni de diseño.

## 4. Páginas públicas

Todas las páginas públicas (Nosotros, las 5 líneas de `servicios/*`,
Contacto, PQR, Trabaja con nosotros [+ detalle de vacante], Blog [+
artículo], Noticias [+ artículo], las 3 legales) ya tenían `title` +
`description` + `openGraph` razonables (sección construida en una etapa
anterior del proyecto). Se agregó a cada una lo que faltaba:

- `alternates.canonical` (sección 14) — 0 páginas lo tenían antes.
- Bloque `twitter` (`summary_large_image`, sección 16) — 0 páginas lo tenían.
- Blog/Noticias `[slug]`: `openGraph.type: "article"` + `publishedTime`
  (+ `authors` en Blog, que sí tiene autor; Noticias no expone autor en el
  backend, así que no se inventó uno) — sección 7.
- Nosotros: se corrigió una frase de la descripción SEO que mencionaba
  "gestión financiera" — no es una línea real de Capital — por lenguaje
  alineado a las 5 líneas reales (SST, Seguridad Vial, Gestión Humana,
  Formación, Soluciones Empresariales). No se tocó el resto del contenido.
- PQR/Trabaja con nosotros: la `description` se ajustó al texto del brief
  (mismo sentido, sin alterar el contenido comercial).

Las páginas legales (`/politica-privacidad`, `/terminos-y-condiciones`) ya
tenían implementado correctamente "no indexar mientras esté pendiente de
aprobación oficial" (`PRIVACY_POLICY_IS_OFFICIAL`/`TERMS_IS_OFFICIAL` en
`src/data/legal/*.ts`) — brief sección 11, ya resuelto antes de esta tarea.
Solo se les agregó `canonical`.

## 5. Robots y sitemap

- **`src/app/robots.ts`** (nuevo) — permite todo lo público, bloquea
  `/admin`, `/login`, `/forgot-password`, `/reset-password` (el CRM vive
  íntegro bajo `/admin/crm/**`, así que bloquear `/admin` ya lo cubre).
  Declara `sitemap: <SITE_URL>/sitemap.xml`.
- **`src/app/sitemap.ts`** (nuevo) — rutas públicas estables (Home, las 5
  líneas, Nosotros, Blog, Noticias, Contacto, PQR, Trabaja con nosotros) +
  slugs de Blog/Noticias obtenidos en build/request desde los endpoints
  públicos ya existentes (`blogPublicService.getAll()` /
  `newsPublicService.getAll()`, que llaman a `GET /api/v1/public/blog` y
  `GET /api/v1/public/news`). Si el backend no responde durante el build, el
  sitemap se degrada a solo las rutas estáticas (no rompe el build).

## 6. 404

`src/app/not-found.tsx` (nuevo — no existía) con "No encontramos esta
página", CTAs "Volver al inicio" y "Explorar servicios" (ancla `#servicios`
en Home; se agregó `id="servicios"` a `ServicesSection`). Arma su propio
Navbar/Footer/Yuri porque vive fuera del grupo `(public)` (necesario para
capturar cualquier URL sin coincidencia en todo el sitio).

## 7. GEO / NAP

- Dirección oficial: **Carrera 73 G No. 60 A - 52, Bogotá D.C., Colombia**.
- NIT: **902077689-7**.
- Teléfonos: 311 863 6746 (principal), 311 836 4572, 311 836 9245.
- `Footer.tsx` ya no hardcodea estos valores: los lee de `NAP`
  (`src/config/site.ts`).
- JSON-LD `Organization` usa el mismo `NAP` (sección 21, consistencia NAP).
- Se usó `Organization`, **no `LocalBusiness`**: Capital es una consultora
  B2B, no un negocio físico de atención al público — declarar
  `LocalBusiness` sin esa naturaleza real sería sobre-declarar (brief,
  sección 20, prohíbe explícitamente inventar/sobre-declarar datos GEO). Si
  en el futuro se abre una sede con atención presencial al público, vale la
  pena reevaluar.
- No se agregó `hreflang`: el sitio es únicamente `es-CO` hoy (brief,
  sección 23 — no crear variantes ficticias).

## 8. Pendiente / fuera de este alcance

- **Imagen social dedicada (1200×630)**: hoy `SITE.defaultOgImage` usa
  `logo.png` como fallback pragmático. Recomendado: diseñar un social-card
  real por línea de negocio para mejorar el CTR en redes.
- **`NEXT_PUBLIC_SITE_URL` en producción**: debe configurarse explícitamente
  en el entorno de despliegue (`https://www.capitalconsulting.com.co`); sin
  esa variable, el código cae a ese mismo valor por defecto, pero es mejor
  fijarlo de forma explícita (ver `.env.example`).
