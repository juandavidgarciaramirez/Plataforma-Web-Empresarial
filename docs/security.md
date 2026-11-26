# Seguridad de producción — Capital Consulting and Services S.A.S.

> Estado al 2026-09-07. Complementa
> [`docs/backend-audit.md`](./backend-audit.md) (historial de etapas del
> backend). Este documento se centra en el checklist de seguridad del brief
> SEO+GEO+Seguridad: qué ya estaba implementado (auditado, no reescrito) y
> qué se agregó en esta tarea.

## 1. Ya implementado antes de esta tarea (auditado, verificado en código)

| Área | Evidencia |
|---|---|
| Helmet | `app.use(helmet())` en `backend/src/main.ts` — CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`, etc. por defecto. |
| CORS restrictivo | `app.enableCors({ origin: configService.get('corsOrigins'), credentials: true })` — orígenes desde `CORS_ORIGINS` (env), nunca `*` hardcodeado. |
| Rate limiting global | `ThrottlerModule.forRoot([...])` + `ThrottlerGuard` global (`APP_GUARD`) — 100 req/60s por defecto (`THROTTLE_TTL`/`THROTTLE_LIMIT`). |
| JWT + RBAC | `JwtAuthGuard` + `RolesGuard` + `PermissionsGuard` registrados como `APP_GUARD` globales en `AuthModule` — **todo** endpoint requiere autenticación salvo `@Public()`. Superficie pública auditada y acotada a lo necesario (auth, chat, pqr, careers, contact, contenido público, health). |
| Password hashing | `bcryptjs` en `AuthService` (`bcrypt.compare`/hash de `passwordHash`). |
| Login lockout | `login.maxAttempts`/`login.lockoutMinutes` (env) en `AuthService` — bloqueo temporal tras intentos fallidos. |
| Refresh tokens | `JWT_ACCESS_EXPIRES_IN` (15m) / `JWT_REFRESH_EXPIRES_IN` (7d), revocación en `logout`. |
| Validación global | `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })` global — rechaza campos no declarados en los DTOs (protección base contra payloads maliciosos). |
| Upload security | `backend/src/common/utils/file-upload.util.ts`: whitelist de extensión **y** MIME por regla (`PQR_ATTACHMENT_RULE`, `RESUME_RULE`, `GENERIC_FILE_RULE`), límite de tamaño por `Multer`, nombre de archivo aleatorio (`randomUUID()` — nunca se confía en el nombre original). |
| Descarga de archivos protegida | `GET /files/:id/download` requiere `foundation.files.read` (no hay URLs públicas directas a CV/adjuntos). |
| Errores sanitizados | `GlobalExceptionFilter`: en 5xx siempre responde `{ success: false, message: "Error interno del servidor", errors: [] }`, nunca stack trace ni ruta interna; loguea el detalle real solo server-side. |
| Audit log | `AuditService.log(actor, action, detail)` — usado en Files, Auth, etc. |
| Legal / GEO | Páginas de política de privacidad y términos no se indexan mientras estén en borrador (`PRIVACY_POLICY_IS_OFFICIAL`/`TERMS_IS_OFFICIAL`). |
| Base de datos | Único acceso a PostgreSQL es backend → Prisma → Postgres; el frontend nunca toca la base directamente. |

## 2. Agregado en esta tarea

- **Rate limiting por ruta** (`@Throttle`, `@nestjs/throttler`) sobre el
  límite global en los endpoints públicos más sensibles a abuso:
  - `POST /auth/login` — 10/min
  - `POST /auth/refresh` — 30/min
  - `POST /auth/forgot-password` — 3/min
  - `POST /auth/reset-password` — 10/min
  - `POST /chat/message` (Yuri) — 20/min
  - `POST /pqr` — 5/min
  - `POST /contacts` — 5/min
  - `POST /careers/applications` — 5/min

  Límites conservadores para no bloquear usuarios legítimos (brief, sección
  32); ajustar con datos reales de tráfico una vez en producción.

- **Health checks** (`backend/src/modules/health/health.controller.ts`):
  - `GET /api/v1/health` (ya existía).
  - `GET /api/v1/health/live` (nuevo) — liveness simple, sin dependencias externas.
  - `GET /api/v1/health/ready` (nuevo) — valida conexión real a PostgreSQL
    (`SELECT 1` vía Prisma); responde 503 sin exponer detalle si falla.

- **`Permissions-Policy`** (`backend/src/main.ts`) — Helmet 8 no la incluye
  por defecto; se deshabilitan explícitamente `camera`, `microphone`,
  `geolocation`, `payment`, `usb` e `interest-cohort` (FLoC), que esta API
  no usa. No interfiere con Swagger (`/api/docs`) ni con ningún flujo
  existente — es un header aparte del CSP.

- **Variables de entorno documentadas** (`.env.example` raíz y backend):
  `NEXT_PUBLIC_SITE_URL` (SEO) y los dominios de producción esperados para
  `CORS_ORIGINS`/`FRONTEND_URL`/`NEXT_PUBLIC_API_URL` — como comentarios de
  referencia, sin tocar secretos reales.

## 3. Verificación de Swagger bajo CSP (Helmet)

Riesgo evaluado antes de tocar nada relacionado a headers: `helmet()` aplica
un CSP por defecto con `script-src: 'self'` (sin `'unsafe-inline'`). Se
confirmó en `node_modules/swagger-ui-express/index.js` que la UI de Swagger
carga sus scripts (`swagger-ui-bundle.js`, `swagger-ui-standalone-preset.js`,
`swagger-ui-init.js`) como archivos **same-origin** (`<script src="...">`),
no inline — por lo tanto el CSP por defecto de Helmet no debería bloquear su
carga. Pendiente de confirmación manual en navegador (algunas versiones de
`swagger-ui-bundle` usan `eval()` internamente para el visor de esquemas,
lo que sí requeriría `'unsafe-eval'` en `script-src` si ocurre — no se pudo
verificar desde CLI). Ver checklist de verificación manual más abajo.

## 4. Hallazgo observado (no corregido — fuera del alcance aprobado de esta tarea)

Al probar `GET /admin/dashboard` sin cookie de sesión (`curl`, sin JS), el
servidor Next.js responde **200** con el shell HTML de la página en vez de
un 307/308 a `/login`. `middleware.ts` (sección "Protección de rutas
administrativas") declara `matcher: ["/admin/:path*"]` y debería
redirigir — no se determinó la causa exacta (posible orden de evaluación en
`next dev`, o que el matcher no cubre algún caso). **No es una fuga de
datos real**: el HTML devuelto es solo el shell (RSC payload vacío, "Bienvenido"
es texto estático de la plantilla); los datos reales del panel se piden
desde el navegador vía `axios` con el access token, y esas llamadas sí están
protegidas por `JwtAuthGuard`/`RolesGuard`/`PermissionsGuard` en el backend
(devuelven 401, y el interceptor de `src/lib/api/axios.ts` redirige a
`/login` en el primer 401 — consistente con que el brief, sección 42, pida
explícitamente no depender únicamente del middleware frontend). Aun así, es
una brecha defense-in-depth real (se sirve el shell HTML/JS del panel a un
visitante no autenticado) que vale la pena que el equipo revise;
no se corrigió aquí porque tocar `middleware.ts` estaba fuera del alcance
aprobado (mecanismo de sesión/autenticación, sección "Fuera de alcance" del
plan de esta tarea).

## 5. Recomendaciones pendientes (fuera de alcance de esta tarea)

- **Cookies HttpOnly same-origin para la sesión**: hoy el frontend guarda el
  access token en `localStorage` + una cookie legible (`access_token`, no
  `HttpOnly`) para que `middleware.ts` pueda proteger `/admin/*` sin hacer
  una llamada al backend en cada request — documentado explícitamente en
  `middleware.ts` como decisión pragmática porque el backend NestJS vive en
  un origen/puerto distinto al frontend Next.js (no puede setear una cookie
  `HttpOnly` en el dominio del frontend desde otro origen). La validez real
  del token la sigue verificando `JwtAuthGuard` en cada request — no es una
  vulnerabilidad de autorización, pero si un XSS lograra ejecutar JS en el
  frontend, podría leer el token. Solución completa: servir frontend y
  backend bajo el mismo dominio (reverse proxy — `api.capitalconsulting.com.co`
  ya es un subdominio, así que las cookies `HttpOnly` con
  `Domain=.capitalconsulting.com.co` sí serían viables) — es un cambio de
  arquitectura de despliegue, no de código de una sola tarea.
- **Swagger tras autenticación en producción**: el brief lo deja como
  condicional ("si corresponde"). Hoy `/api/docs` es público en todos los
  entornos. Recomendado: gatear `SwaggerModule.setup` detrás de
  `NODE_ENV !== 'production'`, o exigir Basic Auth/IP allowlist en
  producción — no se implementó en esta tarea para no interrumpir el flujo
  de QA actual sin acuerdo explícito del equipo.
- **`npm audit`**: se corrió en ambos proyectos (2026-09-07) — 4
  vulnerabilidades en frontend (3 high, 1 critical, `swiper`/`postcss`/`sharp`)
  y 27 en backend (11 high, incluyendo `multer`, dependencia real de
  producción). Todas las correcciones disponibles son *breaking changes*
  (major bumps de `swiper`, `next`, `@nestjs/cli`, `@nestjs/platform-express`)
  — no se aplicaron sin probar compatibilidad, salvo `qs` (moderate) que sí
  tiene un fix no breaking pendiente de aplicar. Detalle completo en
  `docs/deployment-security.md`.

## 6. Checklist de seguridad (brief, sección 58)

- [x] HTTPS — depende de la infraestructura de despliegue (ver `docs/deployment-security.md`); código no fuerza HTTP en ningún punto.
- [x] CORS restrictivo (env-driven, sin `*`)
- [x] Helmet
- [ ] CSP explícito y ajustado a recursos reales — hoy son los defaults de Helmet (verificar manualmente Swagger, ver sección 3)
- [x] HSTS (incluido en defaults de Helmet)
- [x] Rate limiting (global + por ruta sensible, agregado en esta tarea)
- [x] JWT
- [x] Refresh tokens
- [x] RBAC (`RolesGuard` + `PermissionsGuard`)
- [x] Validation (`ValidationPipe` global + DTOs con `class-validator`)
- [x] XSS protection (envelope de errores sanitizado; sanitización de contenido CMS — ver `docs/backend-audit.md` para el detalle por módulo de Content)
- [x] Upload security
- [x] Audit logs
- [x] Secret management (env vars, nunca en código; ver sección 39 del brief)
- [ ] Secure cookies (`HttpOnly`) — ver recomendación pendiente arriba
- [x] Error sanitization
- [x] Dependency audit — corrido; hallazgos altos/críticos documentados, pendientes de una actualización mayor evaluada aparte (ver sección 4)
- [x] Database least privilege — acceso exclusivo backend → Prisma → Postgres
