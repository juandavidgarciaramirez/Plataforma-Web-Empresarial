# Auditoría del backend — Capital Consulting and Services S.A.S.

> **Actualización 2026-08-26 (Etapa 2 — Security):** el hallazgo crítico #1
> de este documento ("el backend no está conectado a PostgreSQL") ya **no**
> aplica al dominio `security` (Auth/Users/Roles/Permissions): está
> conectado a `jud_platform_dev` vía Prisma (`backend/prisma/schema.prisma`,
> introspectado — sin Prisma Migrate, las migraciones siguen siendo SQL a
> mano). Ver `database/docs/MIGRATION_LOG.md` (Etapa 2) para el detalle del
> catálogo de permisos/roles real y el mapeo de claves. Sigue aplicando sin
> cambios a CRM/Content/PQR/Careers (siguen en memoria) y a todo lo demás
> marcado FALTANTE en este documento (Email/WhatsApp/Files/Notifications/
> Settings, tests, docs restantes).
>
> **Actualización 2026-08-26 (Etapa 3 — Retiro del segundo backend, parcial):**
> el hallazgo crítico #2 ("existe un segundo backend") quedó resuelto para
> **PQR, Contacto y Careers/Applications**: `src/features/{pqr,contact,careers}`
> (controller/service/repository) y `src/app/api/v1/{pqr,contacts,careers/
> applications,careers/positions}/**` se eliminaron. Ahora `POST /api/v1/pqr`,
> `GET /api/v1/pqr/:radicado`, `POST /api/v1/contacts` (módulo nuevo,
> `backend/src/modules/contacts/`), `POST /api/v1/careers/applications`
> (con subida real de hoja de vida a disco) y `GET /api/v1/careers/positions`
> son la única implementación real, en NestJS, con emails internos +
> confirmación al ciudadano vía `ConsoleMailerService` (best-effort, sin SMTP
> real todavía — sección 65, marcado como configuración pendiente) y captura
> de Lead real en el CRM para Contacto (`LeadsService.captureFromWebForm`).
> Los DTOs/constantes de esos tres formularios (`src/features/{pqr,contact,
> careers}/dto/**`, `careers.constants.ts`) se conservaron intactos: los
> siguen usando `PQRForm`/`ContactForm`/`ApplicationForm` para validación en
> cliente. **`Blog` quedó deliberadamente fuera de esta etapa** — su
> duplicado (`src/features/blog` + `src/app/api/v1/blog/**`) sigue existiendo
> porque las rutas equivalentes en NestJS (`GET /blog`, `GET /blog/:id`) hoy
> están protegidas por permisos de Admin, no son públicas, y no tienen
> `:slug`/`featured`/`categories` — hacerlas públicas es un cambio de forma
> distinto (no un simple "borrar el duplicado") que queda pendiente.
>
> Dos bugs reales se encontraron y corrigieron probando estos endpoints en
> vivo (no eran visibles por inspección de código): (1) un intento de
> "arreglo" de codificación UTF-8 en multipart/form-data que en realidad
> **corrompía** texto que Busboy ya decodificaba bien (revertido — Busboy
> 1.6.0 no tiene el bug de latin1-por-defecto de versiones viejas); (2)
> `ValidationPipe`'s `enableImplicitConversion: true` convierte cualquier
> string no vacío (incluido `"false"`) a `true` en propiedades `boolean`
> antes de que `@Transform` lo reciba — los 3 campos de consentimiento
> booleano (PQR y Careers) leían mal el valor real hasta que se corrigió
> para leer `obj[key]` (el valor crudo) en vez del ya-convertido `value`.
>
> **Actualización 2026-08-27 (Etapa 4 — CRM conectado a PostgreSQL):**
> Companies, Contacts, Leads, Opportunities, Tasks y Pipeline (vista sobre
> Opportunities) ya usan `jud_platform_dev` real — ver
> `database/docs/MIGRATION_LOG.md` (Etapa 4) para el detalle completo:
> catálogo de fuentes de lead ampliado, empresa placeholder para contactos
> sin empresa, y las tablas `crm.opportunities`/`crm.tasks` creadas de cero
> (no existían). `CrmSeedService` (datos "(Demo)") se retiró de
> `SeedModule` — sembrar eso ahora insertaría filas falsas en la base real.
> Verificado end-to-end: captura pública de lead → resolución real de
> contacto/empresa → conversión a oportunidad real → tablero de pipeline →
> `admin/summary` con números reales, sin duplicar contactos en envíos
> repetidos. Además se corrigió un bug sistémico encontrado en el camino:
> 18 DTOs de CRM validaban ids con `@IsUUID()`, pero desde la Etapa 2 los
> ids reales de usuario (y ahora de companies/contacts/leads) son
> bigint-como-string, no UUID — las validaciones rechazaban ids reales
> válidos. Activities sigue en memoria (`crm.lead_activities` exige
> `lead_id` NOT NULL; el módulo de la app permite actividades sueltas sobre
> company/contact/opportunity sin lead — reconciliar es trabajo aparte).

Fecha: 2026-08-25
Alcance: NestJS (`backend/`), capa paralela en Next.js (`src/app/api/v1/**` +
`src/features/**`), y PostgreSQL `jud_platform_dev`.

Metodología: lectura de código (sin ejecutar nada destructivo) sobre
`backend/src/**`, `src/app/api/v1/**`, `src/features/**`, `src/services/**`,
`src/hooks/**`, `database/**`. No se modificó ningún archivo de negocio, solo
se produce este documento.

Clasificación usada: **EXISTENTE / FUNCIONAL / INCOMPLETO / DUPLICADO /
CONFLICTIVO / FALTANTE**.

---

## 0. Resumen ejecutivo

La plataforma real está mejor construida de lo que un vistazo rápido sugiere:
arquitectura por capas correcta (Controller → DTO → Service → Repository →
persistencia), guards de Auth/Roles/Permissions reales, Swagger real, CRM y
CMS ampliamente escritos, y Yuri ya crea Leads reales en el CRM. **Pero hay
dos hallazgos críticos que bloquean el objetivo central del encargo (sección
6) y que se deben resolver antes de seguir sumando funcionalidades:**

1. **El backend NestJS no está conectado a PostgreSQL.** Las ~30
   implementaciones de repositorio son todas `in-memory-*.repository.ts`
   (`package.json` del backend no tiene `pg`, `typeorm`, `prisma` ni
   `knex`/`sequelize`). Los datos se pierden en cada reinicio del proceso.
   Mientras tanto, `jud_platform_dev` sí existe, con 50 tablas reales y datos
   críticos vivos en `core`/`crm`/`security` (ver `database/audit/BASELINE.md`),
   completamente desconectados del código de la API.
2. **Existe un segundo backend.** `src/app/api/v1/{pqr,contacts,careers,blog}`
   (rutas Next.js) + `src/features/{pqr,contact,careers,blog}` implementan su
   propio Controller→Service→Repository **en memoria, dentro del proceso de
   Next.js**, duplicando exactamente lo que ya existe (o debería existir) en
   el backend NestJS. Esto es justo lo que la regla 7 del encargo prohíbe
   explícitamente. Es la causa de que, por ejemplo, `PqrController` de NestJS
   no tenga endpoint público `POST /pqr`: esa responsabilidad quedó en el otro
   backend.

Ningún módulo de Email, WhatsApp, Notifications, Files o Settings existe
todavía en ninguno de los dos lados (solo hay un `ConsoleMailerService` que
loguea a consola, usado únicamente por el flujo de `forgot-password`).

---

## 1. Base de datos — PostgreSQL `jud_platform_dev`

**Clasificación: EXISTENTE, con datos críticos reales — pero DESCONECTADA del backend.**

Ya auditada en detalle en trabajo previo (no se repite aquí, solo se referencia):

- `database/audit/BASELINE.md` — Etapa 0, línea base completa (schemas, tablas,
  enums, FKs, índices, datos existentes).
- `database/docs/MIGRATION_LOG.md` — Etapa 1 aplicada (creación de schema
  `foundation`, migración no destructiva de 8 tablas de `core`).

Resumen relevante para este documento:

| Dato | Valor |
|---|---|
| Motor | PostgreSQL 17.10 |
| Base de datos | `jud_platform_dev` (única, correcta — regla 2 cumplida) |
| Schemas con tablas reales | `core` (20), `crm` (11), `security` (11), `foundation` (8, migradas en Etapa 1) |
| Schemas vacíos, listos para construir | `catalog`, `content`, `pqr`, `careers`, `audit` |
| Schemas legado (solo enums huérfanos, 0 tablas) | `analytics`, `blog`, `cms`, `config`, `hr`, `integrations`, `media`, `notifications`, `pqrs`, `shared` |
| Datos críticos vivos | `security.roles`=5, `security.permissions`=44, `security.role_permissions`=72, `security.users`=2, `security.positions`=10, `crm.lead_statuses`=10, `crm.activity_types`=15 |

**El backend NestJS no lee ni escribe ninguna de estas tablas.** Todo lo que
el Admin/CRM/CMS muestra hoy proviene de arrays en memoria sembrados al
arrancar el proceso (`SeedService`, `crm-seed.service.ts`, defaults dentro de
cada `in-memory-*.repository.ts`).

**Acción requerida (no ejecutada todavía, es una decisión de arquitectura):**
elegir el mecanismo de acceso a datos (driver `pg` crudo, Prisma introspectado
sobre el esquema real, TypeORM con `synchronize: false` mapeando tablas
existentes, o un query builder tipo Kysely/Knex) y reemplazar cada
`InMemoryXRepository` por su equivalente real, sin tocar los `Controller`ni
`Service` (la interfaz `XRepository` ya está pensada para esto — es el punto
fuerte del código actual). Ver preguntas al final de este informe.

---

## 2. NestJS — `backend/src`

### 2.1 Núcleo / infraestructura — FUNCIONAL (sin persistencia real)

| Componente | Estado | Nota |
|---|---|---|
| `main.ts` (prefijo `api/v1`, versionado, Helmet, CORS, ValidationPipe global, Swagger en `/api/docs`) | FUNCIONAL | Cumple sección 4/49/51 |
| `GlobalExceptionFilter` | FUNCIONAL | Formato `{success, message, errors}` — sección 48 |
| `ResponseInterceptor` / `LoggingInterceptor` | FUNCIONAL | |
| `ThrottlerModule` (rate limiting) | FUNCIONAL | Sección 49 |
| `ConfigModule` + `env.validation.ts` | FUNCIONAL | Falta ampliar variables (ver §5) |
| Health (`/api/v1/health`) | EXISTENTE | No verificado `/health/live` y `/health/ready` (sección 62, opcionales) |

### 2.2 Auth — FUNCIONAL (lógica real, almacenamiento en memoria)

`POST login/refresh/logout`, `GET me`, `forgot-password`, `reset-password`,
`change-password` — los 7 endpoints de la sección 7 existen. JWT real
(access + refresh), `bcryptjs` para hashing, guards reales
(`JwtAuthGuard`, `RolesGuard`, `PermissionsGuard`). Nunca se vio devolver
`password`/secretos en las respuestas (correcto, sección 7).

**INCOMPLETO:** persistencia en `in-memory-auth.repository.ts` e
`in-memory-password-reset.repository.ts` — un reinicio del proceso borra
sesiones, tokens de refresco emitidos y solicitudes de reset pendientes.
Debe mapear a `security.users`, `security.sessions`,
`security.password_resets`, `security.login_attempts` (ya existen y tienen
datos reales, ver §1).

### 2.3 RBAC — Roles / Permissions — FUNCIONAL (memoria)

`RolesModule` y `PermissionsModule` completos con guards
(`@Roles`, `@Permissions`) aplicados en los controllers de CRM/PQR/Careers/etc.
Catálogo de permisos (`permissions.constants.ts`) cubre
`users/roles/services/news/blog/team/pqr/careers/leads/companies/contacts/
opportunities/pipeline/tasks/activities/audit`.

**INCOMPLETO frente a la sección 10 del encargo:**
- Faltan `permissions.read`/`permissions.update` como claves propias.
- Faltan `content.*` (genérico — aunque tener granularidad por
  `services/news/blog/team` es razonable y probablemente mejor; no se
  recomienda duplicar con un `content.*` genérico).
- Faltan `files.*` y `settings.*` por completo (esos módulos ni existen, ver §2.9).
- `crm.assign`/`crm.export` genéricos no existen como tales — en su lugar hay
  `leads.assign`, `opportunities.assign`, `tasks.assign` (más granular, correcto,
  pero falta el `crm.export` que pide la sección 10 si se necesita exportación).

Persistencia: `in-memory-role.repository.ts`, `in-memory-permission.repository.ts`
— deben mapear a `security.roles`, `security.permissions`,
`security.role_permissions` (ya tienen datos reales: 5 roles, 44 permisos, 72
relaciones — ver §1. **Es decir, el catálogo real en Postgres ya es más rico
que las constantes hardcodeadas en el código; hay que auditar la diferencia
antes de migrar, no asumir que las 44 filas de Postgres son iguales a los ~40
`PERMISSION_KEYS` del código.**)

### 2.4 Users — FUNCIONAL (memoria)

CRUD completo. `in-memory-user.repository.ts` → debe mapear a `security.users`
(2 usuarios reales ya existen ahí, hay que preservarlos, no re-sembrar).

### 2.5 Admin (`/api/v1/admin/summary`) — FUNCIONAL (memoria)

`AdminService.getSummary()` calcula los números **a partir de servicios reales**
(no hardcodeados): `usersService.count()`, `leadsService.countNew()`,
`opportunitiesService.countOpen()/openPipelineValue()`, `tasksService.countPending()`,
`pqrService.countOpen()`, `applicationsService.countRecent()`. Cumple la regla
"no inventar números" de la sección 12 — el problema es que esos números hoy
reflejan datos en memoria, no la base real.

### 2.6 CRM — FUNCIONAL (memoria), bien modelado

Módulos completos con Controller/Service/Repository/DTO/Entity propios:
`leads`, `companies`, `contacts`, `opportunities`, `pipeline`, `tasks`,
`activities`. Corresponde bastante bien al schema real `crm.*` de Postgres
(11 tablas: leads, companies, contacts, opportunities... — falta confirmar
mapeo campo a campo en la etapa de conexión real).

`leads.entity.ts` soporta `source` (WEB/YURI/WHATSAPP/etc., sección 34) y
relación con servicio de interés (sección 36) — **cumple la integración
CRM+Servicios a nivel de modelo**, pendiente de verse reflejado con datos
reales una vez conectado Postgres.

**FALTANTE dentro de CRM:** `Notes` y `Tags` como entidades propias
mencionadas en sección 33/35 (`Notes` existe implícita como actividad tipo
`NOTE` en `activities`, ver comentario en `crm/activities.service.ts` —
decisión de diseño razonable, no es un vacío real; `Tags` sí falta).
`Sources` (sección 34) está modelado como enum/string en `lead.entity.ts`,
no como tabla propia — coherente con que `crm.lead_sources` en Postgres sea
una tabla real de catálogo (hay que respetar esa tabla al conectar, no un enum
fijo en código).

### 2.7 Content (CMS parcial) — INCOMPLETO

Existen `blog`, `news`, `services` (contenido de los 5 servicios),
`team` — cada uno con Controller/Service/Repository/DTO/Entity, en memoria.

**FALTANTE — no tiene ni scaffolding todavía (secciones 14, 16, 18):**
- **Home CMS** (hero/slides, secciones de home) — sección 14.
- **Nosotros** (quiénes somos, misión, visión, valores) — sección 16.
- **Organigrama** — sección 18.
- **Business-lines** como concepto propio, si se requiere separado de
  `services` — sección 3/15 lo lista aparte en la estructura de carpetas
  objetivo, pero puede resolverse dentro de `content/services` si "línea de
  negocio" y "servicio" son el mismo concepto en este negocio (a confirmar,
  no asumir).

`services.entity.ts` — pendiente verificar si ya cubre el detalle completo de
la sección 15 (Hero, Secciones, Cards, Procesos, Beneficios, FAQ, CTA final,
SEO) o solo datos generales; no se abrió cada DTO línea por línea en esta
pasada por alcance, se marca **verificar en la próxima etapa** antes de darlo
por completo.

### 2.8 PQR — CONFLICTIVO / INCOMPLETO

`PqrModule` de NestJS **solo tiene `GET /pqr`, `GET /pqr/:id`,
`PATCH /pqr/:id`** (gestión interna). **No existe `POST /pqr`** — el endpoint
público que radica la solicitud del ciudadano (sección 21) no está en NestJS.
Esa responsabilidad la asumió el segundo backend (`src/features/pqr/` +
`src/app/api/v1/pqr/route.ts`), que:
- genera el radicado y responde `201`,
- persiste en `InMemoryPqrRepository` **dentro del proceso de Next.js** (ni
  siquiera comparte memoria con el backend NestJS),
- **no envía ningún correo** (ni interno a `contacto@capitalconsulting.com.co`
  ni de confirmación al ciudadano — sección 26),
- **no crea Lead ni interactúa con el CRM real** (a diferencia de `contact.service.ts`,
  que sí intenta un best-effort hacia `/crm/leads/public`).

**Esto es exactamente el escenario que la regla 7 y la sección 65 prohíben:**
un segundo backend, con persistencia en memoria, para un flujo con
implicaciones legales (radicado de PQR, evidencia de protección de datos).

### 2.9 Careers — CONFLICTIVO / INCOMPLETO

Mismo patrón que PQR: NestJS tiene `vacancies` + `applications` (gestión
interna, CRUD para Admin), pero **no expone `POST /careers/applications`
público** ni maneja el archivo de hoja de vida (no hay `FileInterceptor`/multer
en `applications.controller.ts`). El flujo público real vive en
`src/features/careers/` + `src/app/api/v1/careers/**`, con:
- captura completa del formulario (23 campos, coincide con la sección 23),
- extracción de IP para evidencia de consentimiento (sección 24) — **esto sí
  está bien pensado**,
- **no se confirmó en esta pasada** si guarda el archivo de CV en algún lado
  persistente o solo en memoria del request — **marcar para verificar**,
- **no envía correos** a `peopleandculture@capitalconsulting.com.co` ni de
  confirmación al candidato (sección 26).

### 2.10 Contacto (`/contacts`, sección 22) — CONFLICTIVO

**No existe ningún módulo `contacts` público en NestJS** (el único `contacts`
en NestJS es `crm/contacts`, que es otro concepto — contactos de empresas en
el CRM, no el formulario público de "Contáctenos"). El formulario público
vive enteramente en `src/features/contact/` + `src/app/api/v1/contacts/route.ts`:
guarda en memoria, y sí intenta (best-effort, con `catch` silencioso que solo
loguea) crear un Lead llamando a `POST /crm/leads/public` en el backend NestJS
real. Es la única de las tres integraciones (PQR/Contacto/Careers) que
intenta tocar el backend real, aunque de forma best-effort y no verificada.
**No envía ningún correo** a `ejecutivacomercial@capitalconsulting.com.co` ni
de confirmación al cliente (sección 26) — el propio comentario en el código
lo reconoce explícitamente ("el endpoint público ya queda listo para cuando
haya proveedor de email").

### 2.11 Chat / Yuri — FUNCIONAL (el mejor cableado del proyecto)

`ChatModule` con `chat.service.ts`, `chat.rules.ts`, detección de intención
(`quote`, `pqr`, `careers`, `contact`, `service_inquiry`, `greeting`,
`human_agent`) y **sí crea/actualiza un Lead real vía `LeadsService`** cuando
`outcome.leadIntent === true` — cumple la sección 40 al nivel de código
(pendiente de datos reales una vez Postgres esté conectado). Nombre "YURI" no
se tocó en ningún lado — regla 6 cumplida. No se verificó en esta pasada la
lógica anti-duplicados de sesión (sección 40, "evitar duplicados") a nivel de
detalle.

### 2.12 Audit — INCOMPLETO / decisión pendiente

`AuditModule` existe (controller + service). **No se verificó en esta pasada**
si los demás módulos (Users, Roles, CRM, Content, Auth) efectivamente llaman a
`AuditService` en cada `CREATE/UPDATE/DELETE/LOGIN/...` (sección 43) o si el
módulo está aislado — **marcar para verificar antes de dar por cumplida la
sección 43**. Además sigue pendiente la decisión ya documentada en
`database/audit/BASELINE.md` §8: consolidar `core.audit_logs` +
`security.audit_logs` en `audit.audit_logs` (schema vacío, listo para eso).

### 2.13 Módulos completamente ausentes — FALTANTE

Ninguno de estos tiene ni una carpeta en `backend/src/modules/`:

| Módulo requerido | Sección del encargo | Impacto |
|---|---|---|
| `EmailService` real (SMTP) | 25, 26 | Bloquea correos internos + confirmación al cliente en PQR/Contacto/Careers |
| `WhatsAppService` real | 27–31 | Bloquea confirmaciones por WhatsApp |
| `NotificationService` (orquestador de canales/eventos) | 32 | No hay registro de `notificationId/channel/status/...` |
| `FileService` (upload/validación/storage genérico) | 42 | CVs y adjuntos no tienen un servicio dedicado; `foundation.files` ya existe en Postgres (migrado en Etapa 1) pero nada lo usa |
| `SettingsModule` | Admin (sección 11/45) | `settings.read/update` no tiene endpoint ni tabla usada (`foundation.system_settings` existe, sin consumidor) |
| Home CMS, Nosotros/Valores, Organigrama | 14, 16, 17, 18 | CMS incompleto para esas secciones públicas |

Solo existe `ConsoleMailerService` (loguea a consola), inyectado únicamente en
el flujo de `forgot-password` de Auth — no lo usa PQR, Contacto ni Careers.

### 2.14 Tests — FALTANTE

No hay `jest` ni ninguna librería de testing en `package.json` del backend, ni
archivos `*.spec.ts`/`*.e2e-spec.ts`. La sección 52 (unitarios + E2E) no tiene
ningún avance.

### 2.15 Documentación — INCOMPLETO

`docs/` (raíz del repo) estaba vacío antes de este documento. Existe buena
documentación puntual en `database/audit/BASELINE.md` y
`database/docs/MIGRATION_LOG.md`, pero nada de lo que pide la sección 50
(`architecture.md`, `api.md`, `auth.md`, `admin.md`, `cms.md`, `crm.md`,
`yuri.md`, `email.md`, `whatsapp.md`, `files.md`, `notifications.md`,
`audit.md`, `security.md`, `deployment.md`, `integration.md`,
`troubleshooting.md`) existe todavía.

---

## 3. Frontend Next.js — capa de servicios (`src/services`, `src/hooks`)

**Clasificación: FUNCIONAL como cliente HTTP.** Todo `src/services/**` está
correctamente escrito para consumir el backend NestJS real
(`/api/v1/auth`, `/api/v1/users`, `/api/v1/roles`, `/api/v1/crm/**`,
`/api/v1/content` vía `blog/news/services/team`, `/api/v1/pqr`,
`/api/v1/careers`, `/api/v1/audit`, `/api/v1/admin/summary`) — es decir, el
Admin/CRM del frontend ya está listo para funcionar en cuanto el backend
tenga datos reales. El problema no está en esta capa.

## 4. Segundo backend embebido en Next.js — CONFLICTIVO (hallazgo central)

```
src/app/api/v1/
  blog/**                → src/features/blog/*
  careers/applications    → src/features/careers/*
  careers/positions/**    → src/features/careers/*
  contacts                → src/features/contact/*
  pqr/**                  → src/features/pqr/*
```

Cada uno de estos sigue el mismo patrón: `route.ts` (Next.js Route Handler) →
`XController` (objeto plano, no NestJS) → `XService` → `XRepository` (en
memoria, `Map`/array module-level). Esto duplica intención con los módulos
NestJS equivalentes (`ContentModule/blog`, `CareersModule`, `PqrModule`) y en
el caso de `contacts` no tiene ningún equivalente NestJS en absoluto.

Esto es lo que la regla 7 llama "segundo backend" y hay que resolverlo con
una decisión explícita (ver preguntas al cierre) — no se tocó nada de este
código en esta auditoría.

---

## 5. Variables de entorno — INCOMPLETO frente a la sección 5

`backend/.env.example` actual solo cubre: `NODE_ENV, PORT, API_PREFIX,
CORS_ORIGINS, JWT_ACCESS_SECRET/EXPIRES_IN, JWT_REFRESH_SECRET/EXPIRES_IN,
THROTTLE_TTL/LIMIT, SEED_ADMIN_EMAIL/PASSWORD`. `backend/.env` (desarrollo
local) además ya tiene `DB_HOST/PORT/USERNAME/PASSWORD/DATABASE` apuntando a
`jud_platform_dev` — **es decir, las credenciales de conexión real ya están
configuradas y esperando que el código las use.**

Faltan del `.env.example` (sección 5): `DATABASE_URL` (o el driver elegido),
`SMTP_*`, `WHATSAPP_*`, `PUBLIC_APP_URL`/`API_PUBLIC_URL`,
`FILE_STORAGE_PROVIDER`/`FILE_STORAGE_PATH`.

---

## 6. Housekeeping (menor, no bloqueante)

- `backend/backend-production.zip.zip` (447 KB) y `backend/dist.zip` (398 KB)
  son artefactos de build sueltos en la raíz de `backend/` — no se tocaron en
  esta auditoría, solo se anota su presencia por si conviene ignorarlos en
  git o limpiarlos manualmente más adelante.

---

## 7. Matriz de cumplimiento — "Criterio real de finalización" (sección 64)

| Criterio | Estado |
|---|---|
| PostgreSQL `jud_platform_dev` conectado | ❌ NO — esquema real existe, backend no lo usa |
| Auth real | 🟡 lógica real, persistencia en memoria |
| Admin real | 🟡 cálculo real, datos en memoria |
| CMS real (Servicios/Nosotros/Home/Equipo/Noticias/Blog) | 🟡 Servicios/Noticias/Blog/Equipo con scaffolding (memoria); Nosotros/Home/Organigrama faltantes |
| PQR real | ❌ público duplicado en segundo backend, en memoria, sin email |
| Contacto real | ❌ solo existe en segundo backend, en memoria, sin email |
| Careers real | ❌ público duplicado en segundo backend, sin email, CV sin FileService |
| CRM real | 🟡 completo en código, en memoria |
| Yuri integrado | ✅ integrado con CRM a nivel de código (memoria) |
| Emails internos | ❌ no implementado (solo consola, solo en forgot-password) |
| Emails al cliente | ❌ no implementado |
| WhatsApp real | ❌ no implementado |
| Uploads reales | ❌ no implementado (`foundation.files` existe, sin consumidor) |
| Auditoría | 🟡 módulo existe, cobertura real sin verificar |
| RBAC | 🟡 funcional, catálogo incompleto vs. sección 10 |
| Swagger | 🟡 configurado, cubre solo lo que existe |
| Tests | ❌ ninguno |
| Documentación | 🟡 este documento + BASELINE/MIGRATION_LOG; falta el resto de `docs/*.md` |
| Producción preparada | ❌ sin `DATABASE_URL` real en uso, sin email/WhatsApp, sin tests |

---

## 8. Recomendación de secuencia (no ejecutada — pendiente de decisión)

1. **Resolver el segundo backend** (sección 4 de este documento): decidir si
   `src/app/api/v1/{pqr,contacts,careers,blog}` + `src/features/**` se
   retiran y el frontend apunta directo al NestJS real, o si se documenta una
   razón de negocio para que existan (p. ej. Vercel sin poder alcanzar el
   NestJS en algún entorno) — no asumir, preguntar.
2. **Conectar NestJS a `jud_platform_dev`** eligiendo el driver/ORM, y
   reemplazar los `in-memory-*.repository.ts` uno por uno (empezando por
   `security` — Auth/Users/Roles/Permissions, que ya tiene datos reales que
   hay que preservar) sin tocar Controllers/Services.
3. Completar `POST /pqr`, `POST /careers/applications`, `POST /contacts` en
   NestJS (moviendo la lógica ya escrita en `src/features/**`, no
   reescribiendo desde cero).
4. Construir `EmailService`, `FileService`, luego `WhatsAppService` +
   `NotificationService`.
5. CMS faltante (Home, Nosotros, Organigrama).
6. Auditoría (verificar cobertura real + consolidar `audit.audit_logs`),
   RBAC (completar catálogo), tests, resto de `docs/*.md`, despliegue.

Este documento no ejecuta ninguna de estas acciones — es el inventario que
pide la sección 1 del encargo antes de tocar código.

---

## Actualizaciones posteriores (Etapas 3-7, 2026-08-26/28)

Resumen — el detalle completo de cada una está en
`database/docs/MIGRATION_LOG.md` y se referenció en el chat al cerrar cada
etapa:

- **Etapa 3:** se retiró el segundo backend (regla 7) para PQR, Contacto y
  Postulaciones de Careers — `src/features/{pqr,contact,careers}` +
  `src/app/api/v1/{pqr,contacts,careers}/**` se eliminaron; NestJS es ahora
  la única implementación real para esos tres flujos (con emails
  internos/confirmación best-effort vía `ConsoleMailerService`, sin SMTP
  real todavía). **Blog quedó fuera a propósito** — su duplicado sigue
  existiendo porque las rutas NestJS equivalentes hoy son de Admin, no
  públicas. Dos bugs reales de esa etapa: un "arreglo" de UTF-8 que en
  realidad corrompía multipart/form-data (revertido), y
  `enableImplicitConversion` convirtiendo cualquier string no vacío
  (incluido `"false"`) a `true` en booleanos antes de que `@Transform` lo
  viera.
- **Etapa 4:** Companies, Contacts, Leads, Opportunities, Tasks y Pipeline
  conectados a `jud_platform_dev` real. La base real resultó mucho más
  rica de lo que el baseline de la Etapa 0 registraba (creció por fuera de
  este flujo de migraciones, sin documentar) — `crm.leads` exige
  contact_id/assigned_to/created_by reales, y no existía ninguna tabla
  `opportunities`/`tasks` en toda la base (se agregaron, con las
  columnas/convenciones del resto del esquema real). Activities sigue en
  memoria (`crm.lead_activities` exige `lead_id`, la app permite
  actividades sin lead). De paso se corrigió que 18 DTOs de CRM validaban
  ids con `@IsUUID()` cuando los ids reales son bigint-como-string.
- **Bug de infraestructura (no de negocio):** `main.ts` escuchaba solo en
  IPv4 (`0.0.0.0`); los navegadores resuelven `localhost` a IPv6 primero,
  así que cualquier proceso escuchando en IPv6 en el mismo puerto (un
  `next dev` suelto) se quedaba con las peticiones del navegador aunque el
  backend estuviera sano. Corregido escuchando en todas las interfaces.
- **Etapa 5:** Blog, Noticias, Equipo y Servicios conectados a Postgres
  real. El esquema `content` (12 tablas reales) no distinguía Blog de
  Noticias (una sola tabla `posts`) y no tenía ninguna tabla de Equipo;
  `catalog.services` existía pero con 7 filas de una plantilla genérica
  ajena a Capital Consulting. Se agregaron 3 columnas a `content.posts`
  (`post_type`/`cover_image_url`/`author_name`), se creó
  `content.team_members`, y se insertaron los 5 servicios reales de
  Capital Consulting dejando las 7 filas genéricas desactivadas (no
  borradas). Verificado end-to-end. **Sigue pendiente:** Home CMS,
  Nosotros/Valores y Organigrama (secciones 14/16/18) — existe
  `content.pages`+`page_sections` (JSON genérico) que podría servir de
  base, pero diseñar ese contenido es trabajo de diseño aparte, no un
  simple swap de repositorio.
- **Etapa 6:** CRM Activities conectado a Postgres real. Mismo criterio que
  Opportunities/Tasks (Etapa 4): `crm.lead_activities` exige `lead_id` NOT
  NULL y está pensada para una bitácora más rica (duración, ubicación, URL
  de reunión); en vez de aflojarle la restricción, se creó `crm.activities`
  (tabla nueva) con la relación polimórfica opcional que `ActivityEntity`
  ya modelaba en código (lead/company/contact/opportunity, o ninguna).
- **Etapa 7 (Home / Nosotros / Organigrama, 2026-08-28):** las secciones
  14/16/18 quedaron resueltas — se descartó force-fittear en
  `content.pages`+`page_sections` (JSON genérico) y se aplicó el mismo
  criterio de "tabla dedicada por entidad real" usado en todas las etapas
  previas. `content.team_members` (Etapa 5) se extendió con 10 columnas
  para el Organigrama (jerarquía `parent_id`/`org_level`, especialidades y
  certificaciones en JSONB, línea de servicio, perfil transversal). Se
  crearon 4 tablas nuevas: `content.company_profile` (contenido singular de
  Home/Nosotros, fila única), `content.hero_slides` (carrusel de Home),
  `content.company_values` (los 5 valores) y `content.who_we_are_concepts`
  (los 3 conceptos de "Quiénes somos") — las 4 sembradas con el texto real
  ya en producción en `src/data/{about,hero}.ts`, nunca inventado.
  Excepciones documentadas explícitamente (regla de oro contra datos
  fabricados): las estadísticas del preview "Conócenos" de Home
  ("50+"/"98%" en `AboutSection.tsx`) NO se sembraron — no tienen fuente
  verificable — quedan en NULL como CONFIGURACIÓN PENDIENTE; Misión/Visión
  se sembraron con el mismo texto placeholder que el propio código ya
  marca como provisional, con una columna `mission_vision_is_placeholder`
  para que quede rastreable en el dato mismo. 4 módulos NestJS nuevos
  (`company-profile`, `hero-slides`, `company-values`,
  `who-we-are-concepts`) + extensión de `team-members`, 14 permisos nuevos,
  todo verificado en vivo (login real, CRUD completo, 401 sin token).
  **Alcance de esta etapa:** backend + esquema completos; el Admin UI y el
  wiring de las páginas públicas (Home/Nosotros hoy siguen leyendo
  `src/data/*.ts` estático, no la API) quedan pendientes como seguimiento
  — mismo límite que Blog/News/positions en etapas anteriores.

- **Etapa 8 (2026-08-28):** Home y Nosotros/Organigrama se conectaron al
  sitio público real. `content.team_members` se sembró con los 6
  integrantes reales (llevaba 0 filas desde la Etapa 5). 5 controladores
  públicos nuevos (`@Public()`, mismo patrón que
  `PublicPositionsController` de Careers). `HeroCarousel`, `AboutSection`,
  `/about` y sus 3 componentes hijos dejaron de leer
  `src/data/{about,hero,team}.ts` estático. En `AboutSection` (preview de
  Home) se retiraron cifras y afirmaciones sin fuente verificable ("50+",
  "98%", "Video corporativo") en vez de conservarlas — la sección no se
  renderiza hasta que se cargue contenido real (CONFIGURACIÓN PENDIENTE).
  **Blog y Noticias quedaron fuera a propósito:** `content.posts` sigue en
  0 filas y su modelo (texto plano) no representa el contenido real de
  `src/data/blog.ts` (bloques estructurados, conclusión, CTA, SEO, autor
  con foto) sin perder fidelidad — necesita una extensión de esquema
  propia antes de migrar los artículos reales.

- **Etapa 9 (2026-08-28):** Blog y Noticias conectados al sitio público, y
  Admin UI de Home/Nosotros/Organigrama construido. `content.posts` se
  extendió con 12 columnas (bloques estructurados, conclusión, CTA, SEO,
  autor con foto) y se sembró con los 6 artículos de Blog y 4 noticias
  reales (antes 0 filas). 2 controladores públicos nuevos
  (`/public/blog`, `/public/news`). `/blog`, `/blog/[slug]`, `/noticias`,
  `/noticias/[slug]` dejaron de leer `src/data/*.ts` estático. Nueva
  pantalla `/admin/home-nosotros` (contenido singular + hero slides +
  valores + conceptos) y `/admin/team` extendido con los campos del
  Organigrama. **Incidente no relacionado con el código:** el backend, al
  correr como proceso suelto sin supervisor, se cayó una vez durante la
  sesión — pendiente real: ponerlo bajo un supervisor de procesos.

- **Etapa 10 (2026-08-29):** backend y frontend puestos bajo supervisor de
  procesos (`pm2`) — resuelve el incidente de la Etapa 9. Se encontraron y
  mataron 7 procesos Node huérfanos acumulados de reinicios manuales
  anteriores (root cause real de las caídas: dos procesos compitiendo por
  el puerto 3001, uno de ellos zombie). `ecosystem.config.js` (raíz del
  repo) define ambos procesos con `autorestart: true`; probado en vivo
  matando el proceso del backend directamente — pm2 lo revivió solo en
  ~2s. `pm2 save` + entrada en el registro
  (`HKCU\...\CurrentVersion\Run`) para que `pm2 resurrect` los levante
  también al iniciar sesión en Windows. Comandos: `pm2 status`, `pm2
  logs`, `pm2 restart backend|frontend`.

- **Etapa 11 (2026-08-30):** Auditoría, Files, Settings y Notifications
  pasaron de "no existen" o "en memoria" a reales. `AuditService`
  reescrito para persistir en `security.audit_logs` (antes 100% en
  memoria, se perdía en cada reinicio). Módulos nuevos `Files` (sobre
  `foundation.files`, ya existía sin usar), `Settings` (sobre
  `foundation.system_settings`, ya existía con 5 filas reales sin usar) y
  `Notifications` (tabla nueva, `foundation.notifications`, no existía
  ninguna). Se retiró también el duplicado muerto de Blog
  (`src/features/blog` + `src/app/api/v1/**`, confirmado sin uso).
  **Alcance:** los 3 módulos son backend real y verificado en vivo; no
  tienen pantalla de Admin UI propia todavía, y PQR/Careers/CRM no se
  conectaron automáticamente a Files/Notifications (siguen funcionando
  como antes, sin regresión, pero sin aprovechar el registro central
  todavía) — queda como integración de seguimiento.

- **Etapa 12 (2026-08-30):** Admin UI de Files/Settings/Notifications.
  `/admin/files` (nueva): subir, listar, descargar (blob autenticado,
  `/files/:id/download` exige Bearer) y eliminar. `/admin/settings`:
  se agregó una tarjeta "Configuración del sistema" (editar valores de
  `foundation.system_settings` inline) a la página de cuenta ya
  existente, en vez de crear una página nueva. Notificaciones: la
  campanita del header (antes 100% decorativa, punto rojo fijo) ahora es
  real — contador de no leídas (poll cada 60s), panel desplegable,
  marcar una o todas como leídas. Verificado en vivo extremo a extremo
  (incluida una notificación de prueba creada directamente y consumida
  por el flujo real de lectura).

- **Etapa 13 (2026-08-30):** PQR, Careers Applications y CRM Leads
  (captura pública) ahora notifican automáticamente a los usuarios con
  el permiso correspondiente (`pqrs.tickets.read`, `jobs.applications.read`,
  `crm.leads.read` — vía `NotificationsService.notifyByPermission()`,
  nuevo). PQR y Careers también registran su adjunto/hoja de vida en el
  registro central `foundation.files`, además de seguir sirviéndolo como
  antes. `FilesModule`/`NotificationsModule` se hicieron `@Global()`.
  **Hallazgo importante sin resolver:** al conectar Files se descubrió
  que **PQR y Careers Applications siguen 100% en memoria**
  (`InMemoryPqrRepository`/`InMemoryApplicationRepository`) — se pierden
  en cada reinicio del backend. Las tablas reales ya existen sin usar
  (`pqr.requests` + 8 tablas satélite, esquema normalizado con
  tipos/estados/prioridades por catálogo) pero migrarlas es un trabajo
  del tamaño de una etapa completa (como CRM o Blog/Noticias) — queda
  identificado y documentado, pendiente de decidir con el usuario si se
  aborda.

- **Etapa 14 (2026-08-31):** PQR, Careers Applications y Vacancies
  migrados de `InMemory*Repository` a `Prisma*Repository` real — cierra
  el hallazgo de la Etapa 13. `pqr.requests` (con sus catálogos reales de
  tipos/estados/prioridades ya sembrados) y el esquema ATS completo de
  `careers` (`job_positions`/`candidates`/`applications`) existían sin
  usar. Se creó una vacante placeholder real
  ("Base de Altos Potenciales") para las postulaciones sin vacante
  puntual, mismo patrón que la empresa placeholder de CRM. El adjunto de
  PQR y la hoja de vida ahora se enlazan por FK real a
  `foundation.files` en vez de guardarse como texto plano. Probado en
  vivo de punta a punta (PQR con adjunto, vacante creada y publicada,
  postulación con y sin vacante puntual, notificaciones generadas) — ya
  no queda ningún módulo público-facing en memoria.

**Balance real actual:** Security, CRM completo, Content/CMS
(Blog/Noticias/Equipo/Servicios), Home/Nosotros/Organigrama, Auditoría,
Files, Settings, Notifications, PQR, Careers (Applications + Vacancies)
están conectados a PostgreSQL real, verificados. Backend y frontend
corren bajo pm2 (autorestart + persistencia al reiniciar sesión).

- **Etapa 15 (2026-08-31):** Careers ya deduplica candidatos por correo
  (antes creaba uno nuevo en cada postulación) y una re-postulación a la
  misma vacante (o de nuevo a la Base de Altos Potenciales) actualiza la
  postulación existente en vez de fallar. De paso: alguien cambió la
  salida del cliente de Prisma a una carpeta propia
  (`backend/prisma/generated`, ya no `node_modules/@prisma/client`) en
  una sesión distinta — se regeneró, se agregó `postinstall` en
  `package.json` para que no vuelva a faltar, y se corrigió un archivo
  que todavía importaba `Prisma` del paquete viejo (rompía un
  `instanceof` en runtime). Pendiente menor no bloqueante: el CV anterior
  de una re-postulación queda huérfano en `foundation.files` (no se
  borra automáticamente).

Sigue pendiente: admin para los campos ricos de Blog/Noticias
(bloques/CTA/SEO/autor), Email/WhatsApp reales (bloqueado — requiere
credenciales del cliente), tests, y la mayoría de `docs/*.md`.
