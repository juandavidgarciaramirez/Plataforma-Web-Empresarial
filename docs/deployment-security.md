# Checklist de despliegue a producción — Capital Consulting

> Estado al 2026-09-07. Complementa [`docs/seo.md`](./seo.md) y
> [`docs/security.md`](./security.md). Este documento es la lista de
> verificación operativa para el momento de desplegar a producción — no
> repite el detalle técnico, solo qué configurar y qué probar.

## 1. Dominios (brief, sección 57)

| Servicio | Dominio de producción |
|---|---|
| Frontend | `https://capitalconsulting.com.co` / `https://www.capitalconsulting.com.co` |
| Backend API | `https://api.capitalconsulting.com.co` |

Al desplegar, actualizar en el entorno de producción (nunca en el código):

- **Frontend**
  - `NEXT_PUBLIC_API_URL=https://api.capitalconsulting.com.co/api/v1`
  - `NEXT_PUBLIC_SITE_URL=https://www.capitalconsulting.com.co`
- **Backend**
  - `CORS_ORIGINS=https://capitalconsulting.com.co,https://www.capitalconsulting.com.co`
  - `FRONTEND_URL=https://www.capitalconsulting.com.co`
  - `NODE_ENV=production`
  - `DATABASE_URL` → base de datos de producción (**nunca** la de
    desarrollo `jud_platform_dev` — brief, sección 56).
  - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` → valores propios generados
    para producción, nunca los de `.env.example` ni los de desarrollo.
  - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` → cambiar antes del primer
    despliegue; rotar la contraseña del admin inmediatamente después del
    primer login.

Estas variables ya están **documentadas** (comentarios) en
`.env.example` (raíz) y `backend/.env.example` — no están commiteadas como
secretos reales; hay que definirlas en el entorno de despliegue real.

## 2. HTTPS

El código no fuerza HTTP en ningún punto ni envía credenciales por HTTP.
La terminación TLS y la redirección HTTP → HTTPS son responsabilidad de la
capa de infraestructura (reverse proxy / balanceador / panel de hosting) —
no hay nada que configurar en el código de la app para esto.

## 3. Validación previa al despliegue

```bash
# Frontend
npm run build
npm audit --audit-level=high

# Backend
cd backend
npm run build
npm audit --audit-level=high
```

`npm run build` se corrió en ambos proyectos como parte de esta tarea — sin
errores. `npm audit --audit-level=high` también se corrió (2026-09-07);
hallazgos y por qué no se corrigieron automáticamente (brief, sección 52: no
actualizar masivamente sin revisar compatibilidad — **todas** las
correcciones disponibles son *breaking changes*):

- **Frontend**: 4 vulnerabilidades (3 high, 1 critical).
  - `swiper` (critical, prototype pollution) — el fix salta de v6/v8 a v14
    (breaking). Swiper se usa en carruseles del sitio; requiere probar
    manualmente tras actualizar.
  - `postcss`/`sharp` (high, vía `next`) — el fix requiere Next 16 (breaking,
    el proyecto está en Next 15).
- **Backend**: 27 vulnerabilidades (11 high, 12 moderate, 4 low).
  - `multer` (high, DoS) — es una dependencia **real de producción** (subida
    de CV/PQR); el fix requiere `@nestjs/platform-express` v12 (breaking).
    Priorizar su evaluación sobre las demás.
  - El resto (`picomatch`, `tmp`, `webpack`, vía `@nestjs/cli`) son
    dependencias de build/desarrollo, no de runtime — impacto en producción
    limitado, pero igual conviene actualizar cuando se planifique el salto
    de `@nestjs/cli` a v12.
  - `qs` (moderate) tiene un fix **no breaking** disponible
    (`npm audit fix`, sin `--force`) — el único de la lista sin riesgo de
    romper algo; se puede aplicar en un cambio aislado y probado.

Ninguna de estas correcciones se aplicó en esta tarea (todas implican un
major bump que necesita su propia validación de compatibilidad). Antes de
cada despliegue: volver a correr `npm audit --audit-level=high` en ambos
proyectos y decidir explícitamente sobre `multer`/`swiper` en particular.

## 4. Verificación manual post-build (brief, sección 61)

Con el build de producción corriendo localmente (`npm start` en frontend y
backend):

- [ ] Home — carga, Hero, JSON-LD `Organization` presente (`view-source:`),
      title/OG/Twitter correctos.
- [ ] Servicios (las 5 líneas) — cada una con su título/canonical propios.
- [ ] Nosotros — sin la frase "gestión financiera" corregida.
- [ ] Blog (listado + un artículo) — `og:type=article`, `publishedTime`.
- [ ] Noticias (listado + una noticia).
- [ ] PQR — formulario funciona; rate limit no bloquea un envío normal.
- [ ] Contacto — formulario funciona.
- [ ] Trabaja con nosotros (listado + detalle de una vacante).
- [ ] Login / Admin / CRM — siguen protegidos por `JwtAuthGuard`/RBAC; sin
      regresiones visuales.
- [ ] **Revisar** `middleware.ts` (protección de `/admin/:path*`): en las
      pruebas de esta tarea, `GET /admin/dashboard` sin cookie de sesión
      devolvió 200 (shell HTML) en vez de redirigir a `/login` — ver
      `docs/security.md`, sección 4. Los datos reales siguen protegidos por
      el backend, pero vale la pena confirmar el comportamiento esperado del
      middleware antes de producción.
- [ ] Yuri (chat) — sigue apareciendo en todas las páginas públicas,
      incluida la nueva página 404.
- [ ] `GET /robots.txt` — permite público, bloquea `/admin`, `/login`,
      `/forgot-password`, `/reset-password`.
- [ ] `GET /sitemap.xml` — incluye Home + 5 líneas + Nosotros + Blog/Noticias
      publicados + Contacto/PQR/Careers; no incluye Admin/CRM/Login/API.
- [ ] URL inexistente → página 404 nueva (CTAs "Volver al inicio" /
      "Explorar servicios").
- [ ] `GET /api/v1/health`, `/api/v1/health/live`, `/api/v1/health/ready`
      responden 200 con la base de datos de producción conectada.
- [ ] `GET /api/docs` (Swagger) carga correctamente en el navegador (no solo
      vía `curl`) — confirmar que el CSP de Helmet no bloquea la consola de
      pruebas (ver `docs/security.md`, sección 3).
- [ ] Rate limit endurecido en `/auth/login`: 11 intentos seguidos en menos
      de un minuto deben devolver 429 en el último.

## 5. No incluido en este despliegue (decisión explícita, ver `docs/security.md`)

- Cookies de sesión `HttpOnly` same-origin (requiere decidir arquitectura de
  proxy/subdominio compartido).
- Autenticación obligatoria para Swagger en producción.
- Imagen social (Open Graph) dedicada de 1200×630 por línea de negocio.
