# MIGRATION LOG — jud_platform_dev

Registro cronológico de cada cambio ejecutado sobre la base de datos.
Cada entrada corresponde a un archivo en `database/migrations/`.

---

## 2026-08-23 — Etapa 0 — Auditoría de línea base

- **Archivo:** `database/audit/000_baseline_queries.sql` (solo lectura, no
  es una migración — no está en `database/migrations/`)
- **Cambio:** ninguno. Se ejecutaron únicamente `SELECT` sobre catálogos del
  sistema (`pg_catalog`, `information_schema`) para levantar el estado real
  de `jud_platform_dev`.
- **Motivo:** regla de oro del proyecto — auditar antes de escribir
  cualquier DDL.
- **Tablas afectadas:** ninguna.
- **Datos afectados:** ninguno.
- **Resultado:** ver `database/audit/BASELINE.md`. 50 tablas reales en
  `core`/`crm`/`security`, 6 schemas de la arquitectura nueva vacíos
  (`foundation, catalog, content, pqr, careers, audit`), 11 schemas legado
  sin tablas (solo ENUMs huérfanos). Datos críticos confirmados intactos:
  `security.roles`=5, `security.permissions`=44,
  `security.role_permissions`=72, `security.users`=2,
  `security.api_clients`=1, `security.positions`=10,
  `crm.lead_statuses`=10, `crm.activity_types`=15.
- **Estado:** PASS. Sin bloqueos para continuar con la Etapa 1.

---

## 2026-08-23 — Etapa 1 — Foundation

- **Archivo:** `database/migrations/001_foundation.sql`
- **Cambio:** `CREATE SCHEMA IF NOT EXISTS foundation;` + `ALTER TABLE ...
  SET SCHEMA foundation;` sobre 8 tablas antes ubicadas en `core`:
  `system_settings`, `storage_providers`, `files`, `file_versions`,
  `file_categories`, `file_tags`, `file_shares`, `file_access_logs`.
- **Motivo:** son infraestructura transversal de plataforma (almacenamiento
  genérico de archivos y configuración del sistema), no "recursos
  corporativos" ligados a una empresa/contacto puntual — encajan con la
  definición de `foundation` (encargo, sección 13) y no están en la lista
  de tablas de `core` protegidas explícitamente (sección 15).
- **Tablas afectadas:** las 8 movidas + `crm.lead_files` (su FK
  `fk_file` ahora apunta a `foundation.files` en vez de `core.files`,
  actualizado automáticamente por Postgres al mover la tabla referenciada).
- **Datos afectados:** ninguno — las 8 tablas tenían 0 filas.
- **Verificación:** `database/migrations/001_foundation_verify.sql` — 8
  tablas y 8 secuencias identity confirmadas en `foundation`, `core` pasó
  de 28 a 20 tablas, 0 tablas `file%` remanentes en `core`, los 5 FKs que
  apuntan a `foundation.files` (incluyendo `crm.lead_files`) resueltos
  correctamente.
- **Resultado:** PASS. Operación reversible (`SET SCHEMA core` revierte
  sin pérdida de datos si hiciera falta).

---

## 2026-08-26 — Etapa 2 — Security (catálogo de permisos y roles)

- **Archivo:** `database/migrations/002_security_catalog.sql`
- **Ejecutado vía:** Prisma Client (`prisma.$transaction` + `$executeRawUnsafe`
  statement por statement) — no hay `psql` instalado en este entorno, ver
  `docs/backend-audit.md` §"Etapa 2". Todo dentro de una única transacción
  (equivalente al `BEGIN/COMMIT` del propio archivo).
- **Contexto previo:** al introspeccionar `jud_platform_dev` con Prisma
  (`backend/prisma/schema.prisma`) se confirmó que el catálogo real de
  `security.permissions`/`security.roles` no comparte ni un solo string con
  lo que el código NestJS traía hardcodeado: permission_key real de 3 partes
  (`modulo.recurso.accion`, ej. `crm.leads.read`) vs. el formato de 2 partes
  del código (`leads.read`); roles reales en español
  (Administrador/Editor/Comercial/Cliente/Visitante) vs. los 7 en inglés que
  asumía el código. Decisión del usuario (registrada en la conversación):
  adoptar el formato real de 3 partes, conservar los 5 roles reales tal cual
  y solo agregar los 2 que faltaban (RRHH, Soporte), dejar intactos los 2
  usuarios de plantilla existentes (`admin@judplatform.com`, `adminin`) y
  crear el SUPER_ADMIN real vía el `SeedService` de la app (no por SQL, para
  no versionar secretos).
- **Cambio:** únicamente `INSERT` (ninguna fila existente se borró, actualizó
  ni renombró):
  - 32 filas nuevas en `security.permissions` (roles.*, crm.tasks.*,
    crm.pipeline.read, crm.opportunities.*, crm.activities.*,
    crm.leads.assign/convert, cms.team.*, cms.news.*, audit.logs.read) —
    cubren los módulos que el backend NestJS ya implementa en código y que
    el catálogo real todavía no tenía.
  - 2 filas nuevas en `security.roles` ("Recursos Humanos", "Soporte"),
    `is_system=true` igual que los 5 roles reales existentes.
  - 65 filas nuevas en `security.role_permissions`: Administrador +32 (queda
    con acceso total, 76/76), Editor +8 (cms.team.*/cms.news.*, queda en 20),
    Comercial +19 (resto de CRM, queda en 31), Recursos Humanos +4 (nuevo),
    Soporte +2 (nuevo). `Cliente` (4) y `Visitante` (0) no se tocaron — sin
    código todavía que dependa de ellos, y extender `Visitante` a lectura
    global habría contradicho su descripción real ("Usuario público");
    queda como decisión pendiente, no asumida.
- **Tablas afectadas:** `security.permissions`, `security.roles`,
  `security.role_permissions`. `security.users` no se tocó.
- **Datos afectados:** los 2 usuarios de plantilla (`admin@judplatform.com`,
  `adminin`) siguen exactamente iguales (verificado explícitamente, ver
  verify). Las 44 filas de permisos y 5 roles previos no cambiaron de id,
  nombre, ni descripción.
- **Verificación:** `database/migrations/002_security_catalog_verify.sql` /
  `.out.txt` — 76 permisos, 7 roles, las 32 claves nuevas presentes, conteo
  de permisos por rol exacto, 0 duplicados en `permission_key`/`name`, los 2
  usuarios existentes intactos.
- **Resultado:** PASS. Reversible con `DELETE` por `permission_key` (32) /
  `name` de rol (2) / las 65 filas de `role_permissions` insertadas, si
  hiciera falta — ninguna fila previa fue modificada.

---

## 2026-08-26 — Hallazgo — crecimiento no documentado del esquema real

Antes de la Etapa 4, al re-introspeccionar con Prisma para trabajar en CRM,
se encontró que `jud_platform_dev` creció muchísimo desde el baseline de la
Etapa 0 (2026-08-23): los schemas `catalog` (12 tablas), `content` (12),
`pqr` (10, incluida una tabla `requests` rica con asignaciones/adjuntos/
mensajes/historial) y `careers` (13, incluidas `candidates`/`job_positions`/
`applications`/evaluaciones/entrevistas) pasaron de vacíos a tener decenas de
tablas reales, varias ya con catálogos sembrados (`catalog.industries`=17,
`catalog.services`=7, `core.cities`=1122, etc.). **Este trabajo no se hizo
desde este flujo de migraciones** (no hay archivos nuevos en
`database/migrations/` que lo expliquen, ni commits de git al respecto) —
se hizo por fuera, con otra herramienta o directamente contra la base. Se
registra aquí para que quede trazado: `crm` en sí NO cambió (sigue con las
mismas 11 tablas), así que la Etapa 4 no se vio afectada, pero PQR y Careers
(Etapa 3 de este mismo trabajo) ahora tienen un esquema real mucho más rico
del que se usó — pendiente de reconciliar en una etapa futura (ver
docs/backend-audit.md).

---

## 2026-08-26 — Etapa 4 — CRM (catálogo + tablas nuevas)

- **Archivo:** `database/migrations/003_crm_catalog.sql`
- **Ejecutado vía:** Prisma Client (mismo método que la Etapa 2 — no hay
  `psql` en este entorno), una única transacción.
- **Contexto previo:** al introspeccionar `crm.leads` se confirmó que es
  bastante más rico que el `LeadEntity` del código: `contact_id`,
  `assigned_to`, `source_id`, `status_id`, `pipeline_id`, `stage_id` son
  NOT NULL (antes el código no vinculaba leads a contactos/pipeline en
  absoluto). `core.contacts.company_id` también es NOT NULL. Se buscó en
  los 9 schemas y **no existe ninguna tabla `opportunities` ni `tasks`** —
  el diseño real parece fusionar "oportunidad" dentro de `leads` +
  `pipeline_stages`, pero el código NestJS (y el Admin ya construido) tiene
  módulos completos e independientes de Opportunities/Tasks. Decisiones del
  usuario (registradas en la conversación): (1) agregar tablas reales
  `crm.opportunities`/`crm.tasks` en vez de rediseñar esos módulos como
  vistas sobre `leads`; (2) los leads automáticos (Yuri, formulario
  público) se asignan al administrador real
  (`contacto@capitalconsulting.com.co`) hasta reasignación manual; (3)
  agregar las fuentes de lead que faltan (Yuri/Manual/Chat/PQR) en vez de
  forzarlas sobre los 10 canales genéricos ya existentes.
- **Cambio:** únicamente `INSERT` y `CREATE TABLE` (ninguna fila ni tabla
  existente se modificó, renombró ni borró):
  - 4 filas nuevas en `crm.lead_sources`: "Yuri (Chatbot)", "Registro
    Manual", "Chat en Vivo", "PQR" (quedan 14, las 10 reales previas
    intactas).
  - 1 fila nueva en `core.companies`: "Contactos Independientes (Sin
    Empresa)" — empresa placeholder, claramente rotulada como bucket (NO un
    cliente real), usada por `core.contacts.company_id` (NOT NULL) cuando
    el `CreateContactDto` no trae `companyId` — así no hubo que cambiar la
    validación de la API ya usada por el Admin.
  - Tabla nueva `crm.opportunities` (18 columnas: title, company_id,
    contact_id, source_lead_id, value, currency, stage [CHECK con los 6
    valores de `OPPORTUNITY_STAGES`], probability, owner_user_id,
    expected_close_date, closed_at, close_reason, created_by, updated_by +
    auditoría) + 5 índices.
  - Tabla nueva `crm.tasks` (14 columnas: title, description, due_date,
    assignee_user_id, priority [CHECK LOW/MEDIUM/HIGH/URGENT], status
    [CHECK PENDING/IN_PROGRESS/COMPLETED/CANCELLED], related_type/related_id
    [polimórfico, sin FK física — se valida en la app] + auditoría) + 4
    índices.
- **Tablas afectadas:** `crm.lead_sources` (+4 filas), `core.companies`
  (+1 fila), `crm.opportunities` (nueva), `crm.tasks` (nueva).
- **Datos afectados:** `crm.leads` seguía en 0 filas (confirmado antes y
  después). Las 10 fuentes de lead reales y la única empresa real
  ("Capital Consulting") no cambiaron de id, nombre, ni ningún campo.
- **Verificación:** `database/migrations/003_crm_catalog_verify.sql` /
  `.out.txt` — 14 fuentes de lead, empresa placeholder creada, ambas tablas
  nuevas presentes con las columnas/nullability esperadas, `crm.leads`
  sigue en 0, `core.companies` pasó de 1 a 2.
- **Resultado:** PASS. Reversible con `DROP TABLE crm.opportunities,
  crm.tasks` y `DELETE` de las 4 filas de `lead_sources` / 1 fila de
  `companies` insertadas, si hiciera falta — ninguna fila previa fue
  modificada.

---

## 2026-08-28 — Etapa 5 — Content/CMS (columnas + tabla nueva + catálogo)

- **Archivo:** `database/migrations/004_content_catalog.sql`
- **Ejecutado vía:** Prisma Client (mismo método que Etapas 2 y 4), una
  única transacción.
- **Contexto previo:** igual que con CRM (Etapa 4), el esquema `content` ya
  tenía 12 tablas reales (`posts`, `post_categories`, `post_tags`, `pages`,
  `page_sections`, `menus`, `menu_items`, `faqs`, `testimonials`,
  `redirects`) — pero `posts` no distingue Blog de Noticias (un solo tipo
  de artículo) y **no existe ninguna tabla de equipo** (`team`/`member`/
  `staff`, se buscó en toda la base). `catalog.services` sí existe con 7
  filas, pero son de una plantilla genérica de otro negocio ("Consultoría
  Empresarial", "Aplicaciones Móviles", "CRM", "Desarrollo Web", etc.) — no
  los servicios reales de Capital Consulting.
- **Decisiones:** (1) `content.posts` gana columnas nuevas (`post_type`,
  `cover_image_url`, `author_name`) en vez de una tabla paralela para
  Noticias, porque Blog y Noticias son casi el mismo shape real; (2) tabla
  nueva `content.team_members` (no existía); (3) se agregan los 5 servicios
  reales a `catalog.services` y se desactivan (NO se borran) las 7 filas de
  plantilla genérica, para que no aparezcan en el sitio público.
- **Cambio:** únicamente `ALTER TABLE ADD COLUMN`, `CREATE TABLE`, `INSERT`
  y un `UPDATE` de un flag (ninguna fila existente se borró ni se
  sobrescribió con datos distintos a los que ya tenía):
  - `content.posts` +3 columnas: `post_type` (CHECK BLOG/NEWS, default
    BLOG), `cover_image_url` (texto libre — `FileService` real todavía no
    existe), `author_name` (texto libre — el `author_id` real exige un
    usuario del sistema, y los autores de blog/noticias no siempre lo son).
  - Tabla nueva `content.team_members` (12 columnas: name, position, bio,
    photo_url, sort_order, is_active, created_by/updated_by + auditoría).
  - `catalog.services`: 5 filas nuevas (capital-learning, capital-mobility,
    capital-hse, capital-staffing, capital-business-services, todas
    `is_active=true`) + 7 filas existentes pasadas a `is_active=false`
    (CONSULTORIA_EMPRESARIAL, APLICACIONES_MOVILES, CRM, DESARROLLO_WEB,
    DESARROLLO_SOFTWARE, AUTOMATIZACION_PROCESOS, TRANSFORMACION_DIGITAL).
- **Tablas afectadas:** `content.posts` (+3 columnas), `content.team_members`
  (nueva), `catalog.services` (+5 filas, 7 desactivadas).
- **Datos afectados:** `content.posts` seguía en 0 filas (sin pérdida,
  confirmado antes y después). Las 7 filas genéricas de `catalog.services`
  conservan todos sus datos, solo cambió `is_active`.
- **Verificación:** `database/migrations/004_content_catalog_verify.sql` /
  `.out.txt` — columnas nuevas presentes con tipos correctos, tabla
  `team_members` creada, 12 servicios totales (5 reales activos + 7
  genéricos desactivados), `content.posts` sigue en 0.
- **Resultado:** PASS. Reversible con `ALTER TABLE content.posts DROP
  COLUMN`, `DROP TABLE content.team_members`, `DELETE`/`UPDATE
  is_active=true` sobre las filas de `catalog.services` insertadas o
  desactivadas, si hiciera falta.

---

## 2026-08-28 — Etapa 6 — CRM Activities (tabla nueva)

- **Archivo:** `database/migrations/005_crm_activities.sql`
- **Ejecutado vía:** Prisma Client, una única transacción.
- **Contexto previo:** pendiente documentado desde la Etapa 4 —
  `crm.lead_activities` exige `lead_id` NOT NULL, pero `ActivityEntity` (el
  módulo `crm/activities` de la app) permite actividades con relación
  opcional a lead/company/contact/opportunity, o sin relación alguna
  (secciones 24/25 del encargo). En vez de aflojar la restricción de una
  tabla real con un propósito propio y más rico (`lead_activities` ya trae
  duración, ubicación, URL de reunión — pensada para una bitácora
  específica de leads), se agregó una tabla nueva que calza con lo que el
  código ya implementa, mismo criterio que Opportunities/Tasks (Etapa 4).
- **Cambio:** únicamente `CREATE TABLE` (no se tocó ninguna fila ni tabla
  existente): `crm.activities` (10 columnas: type [CHECK con los 10
  valores de `ACTIVITY_TYPES`], description, author_user_id, occurred_at,
  related_type/related_id [polimórfico, sin FK física] + auditoría) + 3
  índices.
- **Tablas afectadas:** `crm.activities` (nueva). `crm.lead_activities` sin
  cambios (sigue en 0 filas, confirmado).
- **Verificación:** `database/migrations/005_crm_activities_verify.sql` /
  `.out.txt` — tabla creada con las columnas/nullability esperadas,
  `lead_activities` intacta.
- **Resultado:** PASS. Reversible con `DROP TABLE crm.activities` si
  hiciera falta — no depende de ninguna otra tabla nueva.

---

## 2026-08-28 — Etapa 7 — Home / Nosotros / Organigrama

- **Archivo:** `database/migrations/006_home_about_organigrama.sql`
- **Ejecutado vía:** Prisma Client, una única transacción. Primer intento
  con ROLLBACK automático (mismo bug de siempre del splitter naive del
  script: un punto y coma dentro de un literal `COMMENT ON COLUMN` — se
  corrigió el texto y se re-ejecutó completo desde cero, sin dejar nada a
  medias).
- **Contexto previo:** las secciones 14 (Home), 16 (Nosotros) y 18
  (Organigrama) del encargo no tenían ningún soporte real en base de
  datos — todo el contenido vivía hardcodeado en el frontend
  (`src/data/about.ts`, `src/data/hero.ts`, `src/data/team.ts`,
  componentes `AboutSection`, `HeroCarousel`, `ValuesGrid`,
  `WhoWeAreConcepts`, `TeamOrgChart`).
- **Cambio:**
  1. `ALTER TABLE content.team_members ADD COLUMN` — 10 columnas nuevas
     (todas opcionales o con default) para soportar el Organigrama:
     `profession`, `area`, `service_code` (FK a `catalog.services.code`),
     `specialties`/`certifications` (JSONB), `certifications_label`,
     `is_transversal`, `org_level` (CHECK 1-3), `parent_id`
     (autorreferencia jerárquica), `connector_curve`.
  2. `CREATE TABLE content.company_profile` — fila única (id=1, CHECK
     `id=1`) con el contenido institucional singular de Home ("Conócenos")
     y Nosotros completo (hero, Quiénes somos, Misión, Visión, Ecosistema,
     encabezado de equipo, CTA). Sembrada con el texto real de
     `src/data/about.ts`. Las 4 columnas de estadísticas del preview de
     Home (`home_about_stat1/2_value/label`) se dejaron en NULL a
     propósito — el "50+"/"98%" que hoy muestra `AboutSection.tsx` es
     marketing filler sin fuente verificable (no viene de `src/data/`),
     así que NO se sembró como si fuera real (CONFIGURACIÓN PENDIENTE,
     regla de oro del encargo contra datos inventados). Misión/Visión se
     sembraron con el mismo texto placeholder que ya trae el código
     (marcado explícitamente en sus comentarios como pendiente del
     documento institucional oficial del cliente) — columna
     `mission_vision_is_placeholder = true` para que quede rastreable en
     el propio dato, no solo en un comentario de código.
  3. `CREATE TABLE content.hero_slides` — carrusel de Home, sembrada con
     las 5 líneas de negocio reales de `src/data/hero.ts` (`items` JSONB
     con `{label, icon}`, mismo patrón de nombre-de-icono-de-lucide-react
     ya usado en `company_values`).
  4. `CREATE TABLE content.company_values` — sembrada con los 5 valores
     reales (Integridad/Privacidad/Excelencia/Innovación/Compromiso).
  5. `CREATE TABLE content.who_we_are_concepts` — sembrada con los 3
     conceptos reales (Personas/Operación/Negocio).
  6. 14 permisos nuevos (`cms.home.read/update`, `cms.hero.*`,
     `cms.values.*`, `cms.concepts.*`) asignados a Administrador y Editor
     (mismo criterio de Etapa 2: Editor ya gestiona
     team/news/blog/services → se le suma este contenido).
- **Tablas afectadas:** `content.team_members` (+10 columnas, 0 filas
  existentes afectadas — la tabla seguía vacía desde Etapa 5),
  `content.company_profile` (nueva, 1 fila), `content.hero_slides` (nueva,
  5 filas), `content.company_values` (nueva, 5 filas),
  `content.who_we_are_concepts` (nueva, 3 filas), `security.permissions`
  (+14), `security.role_permissions` (+28).
- **Datos afectados:** ninguna fila existente se borró, renombró ni
  perdió datos. Todo el texto sembrado es copia real ya en producción en
  el frontend (dos excepciones documentadas explícitamente arriba:
  Misión/Visión placeholder, y stats de Home dejadas en NULL en vez de
  fabricadas).
- **Backend:** `team-members` (entidad/DTO/repositorio Prisma/servicio)
  extendido con los 10 campos del Organigrama. 4 módulos nuevos creados
  desde cero (`content/company-profile`, `content/hero-slides`,
  `content/company-values`, `content/who-we-are-concepts`), cada uno con
  su propio controlador/servicio/repositorio Prisma, registrados en
  `ContentModule`. Alcance de esta etapa: backend + esquema completos y
  verificados en vivo; wiring del Admin UI y de las páginas públicas
  (Home/Nosotros hoy siguen leyendo `src/data/*.ts` estático) queda
  pendiente como seguimiento, mismo criterio que Blog/News/positions en
  etapas anteriores.
- **Verificación:** `database/migrations/006_home_about_organigrama_verify.sql`
  / `.out.txt` — columnas/tablas/conteos/permisos confirmados, datos
  previos intactos. Prueba funcional adicional en vivo (login real +
  GET/PATCH de los 4 endpoints nuevos + POST/GET/DELETE de un integrante
  de prueba en `/team` con los 10 campos nuevos, limpiado después) — todo
  respondió correctamente, incluida la exigencia real de los permisos
  nuevos (401 sin token).
- **Resultado:** PASS. Reversible: `ALTER TABLE content.team_members DROP
  COLUMN` (las 10 nuevas), `DROP TABLE` de las 4 tablas nuevas, `DELETE`
  de los 14 permisos y sus `role_permissions`, si hiciera falta.

---

## 2026-08-28 — Etapa 8 — Conectar Home/Nosotros/Organigrama al sitio público

- **Archivo:** `database/migrations/007_team_members_seed_and_public_content.sql`
- **Cambio:** solo INSERT — se sembraron en `content.team_members` los 6
  integrantes reales y activos de `src/data/team.ts` (la tabla llevaba 0
  filas desde la Etapa 5: nunca se había migrado esa data). Jennifer
  Zuluaga como raíz (`org_level=1`), los otros 5 con `parent_id` apuntando
  a ella (resuelto con subconsultas por nombre, sin CTEs, por cómo ejecuta
  el runner de migraciones). Quedaron fuera a propósito: Julio Betín (está
  comentado en el código fuente, no se renderiza) y "Socia Co-Fundadora"
  (placeholder reservado con campos vacíos — sembrar una fila vacía sería
  fabricar un dato).
- **Backend:** 5 controladores públicos nuevos, uno por recurso ya
  existente, con `@Public()` (mismo patrón que
  `PublicPositionsController` de Careers): `GET /public/hero-slides`,
  `/public/company-profile`, `/public/company-values`,
  `/public/who-we-are-concepts`, `/public/team` — cada uno filtra a
  activo/publicado antes de responder. Verificados en vivo sin token.
- **Frontend:** Home y Nosotros dejaron de leer `src/data/{about,hero,team}.ts`
  estático y ahora consumen la API real:
  - `src/hooks/useSiteContent.ts` (nuevo, mismo patrón `apiGet` + `useQuery`
    que `useCareers.ts`) + `src/lib/icon-registry.ts` (nombre de icono de
    lucide-react → componente, para `items` de hero-slides e `iconKey` de
    company-values).
  - `HeroCarousel.tsx`: usa `useHeroSlides()`; sin slides muestra el fondo
    institucional vacío en vez de contenido de relleno.
  - `AboutSection.tsx` (preview "Conócenos" de Home): reescrito para leer
    `useCompanyProfile()`. Se eliminaron las cifras inventadas ("50+
    Empresas asesoradas", "98% Satisfacción del cliente"), la etiqueta
    "Video corporativo" sin video real, y el checklist de 4 valores que no
    coincidía con los 5 valores reales — ninguno tenía una fuente
    verificable. Como `company_profile.home_about_*` quedó en NULL desde
    la Etapa 7 (CONFIGURACIÓN PENDIENTE), la sección hoy no se renderiza
    en Home hasta que se cargue contenido real vía `PATCH
    /company-profile` — es un cambio visible, documentado aquí a
    propósito, no un efecto colateral silencioso.
  - `about/page.tsx`: convertido a Server Component `async` que hace
    fetch real (`revalidate: 60`) de company-profile/values/concepts/team
    y pasa los datos como props.
  - `WhoWeAreConcepts.tsx`, `ValuesGrid.tsx`, `TeamOrgChart.tsx`: dejaron
    de importar datos estáticos y ahora reciben `concepts`/`values`/
    `members` por props. `TeamOrgChart` deriva las conexiones del
    organigrama (antes `orgEdges` estático) a partir de `parentId` +
    `connectorCurve` de cada integrante.
- **Tablas afectadas:** `content.team_members` (+6 filas). Ninguna otra
  tabla ni fila existente se tocó.
- **Verificación:** `database/migrations/007_team_members_seed_and_public_content_verify.sql`
  / `.out.txt` — jerarquía confirmada en base de datos, los 5 endpoints
  públicos probados sin token, `npm run dev` levantado y `GET /` / `GET
  /about` devuelven 200 sin errores; `/about` (SSR) confirmado con
  contenido real en el HTML servido.
- **Resultado:** PASS. Pendiente explícito de seguimiento: Blog y
  Noticias NO se conectaron en esta etapa — `content.posts` sigue en 0
  filas y su modelo actual (texto plano) no alcanza a representar el
  contenido real de `src/data/blog.ts` (bloques estructurados,
  conclusión, CTA, SEO, autor con foto) sin perder fidelidad; requiere
  una extensión de esquema propia antes de migrar los artículos reales.

---

## 2026-08-28 — Etapa 9 — Blog, Noticias y Admin UI de Home/Nosotros

- **Archivo:** `database/migrations/008_blog_news_content.sql`
- **Cambio:** solo `ALTER TABLE ADD COLUMN` sobre `content.posts` (12
  columnas nuevas, todas opcionales): `subtitle`, `image_alt`,
  `content_blocks` (JSONB — bloques estructurados reales, reemplaza en la
  práctica a `content` como fuente de verdad), `conclusion` (JSONB, solo
  Blog), `cta_label`/`cta_href`, `seo_title`/`seo_description`,
  `author_role`/`author_image_url`, `tags` (JSONB, solo Blog),
  `is_featured` (agregada como fast-follow en la misma sesión, no estaba
  en el archivo original). `content` (texto plano) se conserva intacta.
- **Datos:** se sembraron los 6 artículos reales de `src/data/blog.ts` y
  las 4 noticias reales de `src/data/news.ts` — contenido real ya en
  producción, transcrito sin cambios — vía script Node/Prisma
  (`.create()`, sin SQL manual por el volumen de texto enriquecido).
  `content.posts` pasó de 0 a 10 filas.
- **Backend:** `BlogPostEntity`/`NewsEntity` extendidas con los campos
  ricos (opcionales, no rompen el formulario admin actual). 2
  controladores públicos nuevos (`GET /public/blog[/:slug]`, `GET
  /public/news[/:slug]`), `@Public()`, filtrando `status=PUBLISHED`.
- **Frontend:** `/blog`, `/blog/[slug]`, `/noticias`, `/noticias/[slug]`
  dejaron de leer `src/data/{blog,news}.ts` estático — ahora son Server
  Components que hacen fetch real a la API pública
  (`blogPublicService`/`newsPublicService`, con función adaptadora hacia
  la forma `BlogArticle`/`NewsArticle` que ya consumían `BlogCard`,
  `NewsCard`, `BlogExplorer`, `BlogSpecialists`, etc. — esos componentes
  no se tocaron, cero riesgo de regresión visual).
- **Admin UI:** pantalla nueva `/admin/home-nosotros` (contenido singular
  de Home/Nosotros, hero slides, valores, conceptos de Quiénes somos —
  CRUD completo) y `/admin/team` extendido con los 10 campos del
  Organigrama (profesión, área, servicio, especialidades,
  certificaciones, transversal, nivel, padre, curvatura del conector).
- **Verificación:** backend reiniciado y probado en vivo
  (`/public/blog` = 6, `/public/news` = 4, con `contentBlocks`/`tags`
  correctos); `npm run dev` — `/blog`, `/blog/[slug]`, `/noticias`,
  `/noticias/[slug]`, `/admin/home-nosotros`, `/admin/team` devuelven 200
  con contenido real verificado por texto en el HTML servido.
- **Resultado:** PASS. Pendiente: admin todavía no tiene pantalla para
  editar los campos ricos de Blog/Noticias (bloques, conclusión, CTA,
  SEO, autor) — hoy solo se cargaron por script; el formulario admin
  actual sigue gestionando los campos base.
- **Incidente durante la sesión (no relacionado con el código):** el
  proceso del backend (`node dist/main.js`, lanzado como proceso suelto
  sin supervisor) se cayó solo en algún momento entre etapas, dejando el
  Hero de Home sin datos hasta que se detectó y se reinició. Pendiente
  real: correr el backend bajo un supervisor de procesos (pm2, servicio
  de Windows, etc.) en vez de un proceso manual.

---

## 2026-08-29/30 — Etapa 10 — Supervisor de procesos (pm2)

- **Sin archivo de migración** (no toca la base de datos) — se documenta
  aquí por continuidad con el incidente de la Etapa 9.
- **Causa raíz real encontrada:** 7 procesos Node huérfanos acumulados de
  reinicios manuales anteriores, compitiendo por el puerto 3001 (uno de
  ellos zombie, respondiendo mientras el "real" estaba realmente caído).
  Se mataron todos.
- **Cambio:** `ecosystem.config.js` (raíz del repo) — backend y frontend
  bajo `pm2` con `autorestart: true`. Probado en vivo matando el proceso
  del backend directamente: pm2 lo revivió solo en ~2s. `pm2 save` +
  entrada en `HKCU\...\CurrentVersion\Run` (vía `pm2-windows-startup`,
  con un workaround manual porque su CLI falla con `spawn REG ENOENT` en
  este entorno) para que `pm2 resurrect` los levante también al iniciar
  sesión en Windows.
- **Nota operativa (no resuelta del todo):** en esta sesión, `pm2 restart`
  in-place dejó de escribir a los archivos de log configurados después de
  varios reinicios seguidos (el proceso seguía "online" pero sin loguear
  nada, y a veces sin llegar a bindear el puerto) — el fix que funcionó
  cada vez fue `pm2 delete backend && pm2 start ecosystem.config.js
  --only backend` en vez de `pm2 restart`. Si vuelve a pasar, usar ese
  comando.

---

## 2026-08-30 — Etapa 11 — Auditoría real + Files + Settings + Notifications

- **Archivo:** `database/migrations/009_notifications.sql`
- **Auditoría (sin migración propia, tablas ya existían desde la Etapa 0):**
  `AuditService` vivía 100% en memoria (arreglo con tope de 200, se perdía
  en cada reinicio — y el backend se reinició muchas veces esta sesión).
  Se reescribió para persistir en `security.audit_logs` (existía desde
  antes, 0 filas). `core.audit_logs` (esquema paralelo) queda
  intencionalmente sin usar — decisión documentada en el propio código
  (`audit.service.ts`): `security.audit_logs` es más rico (sesión, IP,
  user-agent, request) y es el que ya referencia el guard de
  autenticación. Los campos de contexto HTTP (ip/user-agent/browser)
  quedan en NULL por ahora — el servicio se invoca desde services, sin
  acceso al `Request`; pendiente si se necesita ese detalle (interceptor
  o `AsyncLocalStorage`). Probado en vivo: login + una acción real
  generaron filas reales con el actor resuelto correctamente por email.
- **Files:** `foundation.files`/`storage_providers` existían desde la
  Etapa 1 (movidas desde `core`) pero ningún módulo las usaba — PQR y
  Careers solo guardaban la ruta como texto plano. Módulo nuevo
  (`FilesController`/`FilesService`/`PrismaFileRepository`) con
  subida real (multipart, reutiliza `diskStorageFor`/`fileFilterFor` ya
  existentes), listado, descarga y borrado lógico. `company_id` (NOT
  NULL en la tabla, diseño multi-tenant) se resuelve siempre a la empresa
  real "Capital Consulting" (`core.companies`, ya sembrada). PQR/Careers
  NO se migraron a este registro central en esta etapa (para no arriesgar
  regresión) — sigue como integración de seguimiento.
- **Settings:** `foundation.system_settings` existía desde la Etapa 1 con
  5 filas reales ya sembradas (`app.name`, `app.environment`,
  `files.max_size_mb`, `files.allowed_extensions`,
  `files.default_folder`) — sin usar. Módulo nuevo: `GET /settings`
  (admin), `GET /settings/public` (público, solo `is_public=true`),
  `PATCH /settings/:key`.
- **Notifications:** no existía ninguna tabla. `CREATE TABLE
  foundation.notifications` (usuario, título, mensaje, tipo, link,
  leída/no leída). Módulo nuevo con listar-las-mías, contar sin leer,
  marcar una o todas como leídas. `NotificationsService.create()` queda
  disponible para que cualquier otro módulo notifique a un usuario — no
  se conectó automáticamente a PQR/Careers/CRM todavía (integración de
  seguimiento).
- **Permisos nuevos:** `foundation.files.read/create/delete`,
  `foundation.settings.read/update` (5), asignados a Administrador.
  Notifications no tiene `permission_key` — cada usuario ve solo lo suyo.
- **Además, en esta etapa:** se retiró el duplicado muerto de Blog
  (`src/features/blog` + `src/app/api/v1/blog/**`) — confirmado que nada
  lo importaba (ni la página pública, que ya usa la API real desde la
  Etapa 9, ni el admin). `src/app/api/v1` quedó vacío y también se borró.
- **Verificación:** `database/migrations/009_notifications_verify.sql` /
  `.out.txt` — tabla y permisos confirmados, `foundation.files`/
  `system_settings` sin alterar. Prueba funcional en vivo de los 3
  módulos nuevos (login real, CRUD/lectura de cada uno) — todo
  respondió correctamente, evidencia de prueba limpiada después.
- **Resultado:** PASS. Reversible: `DROP TABLE
  foundation.notifications`, `DELETE` de los 5 permisos nuevos y sus
  `role_permissions`, si hiciera falta. `core.audit_logs` sigue intacta
  (nunca se tocó).

---

## 2026-08-30 — Etapa 13 — PQR/Careers/CRM → Notifications + Files

- **Sin migración propia** (no crea tablas nuevas). Se conectaron los 3
  flujos públicos que crean contenido a los servicios globales de la
  Etapa 11:
  - `NotificationsService.notifyByPermission(permissionKey, payload)`
    (nuevo): resuelve destinatarios con `SELECT DISTINCT u.id FROM
    security.users u JOIN security.role_permissions ... WHERE
    p.permission_key = ... AND u.status='ACTIVE'` y crea una
    notificación por cada uno. Fire-and-forget — un fallo aquí nunca
    rompe el flujo que lo origina.
  - PQR (`pqr.service.ts`, `createPublic`): notifica a
    `pqrs.tickets.read` al radicar. PQR (`pqr.controller.ts`): el
    adjunto, si viene, también se registra en `foundation.files`
    (`entityType: 'pqr'`) — `attachmentUrl` (como antes) sigue siendo lo
    que realmente sirve el archivo, esto es un registro adicional.
  - Careers Applications (`applications.service.ts`, `createPublic`):
    notifica a `jobs.applications.read`. La hoja de vida también se
    registra en `foundation.files` (`entityType: 'application'`).
  - CRM Leads (`leads.service.ts`, `captureFromWebForm` — captura
    pública sección 31): notifica a `crm.leads.read`.
  - `FilesModule` y `NotificationsModule` se marcaron `@Global()` (igual
    que `AuditModule`) para que cualquier módulo los inyecte sin
    importarlos explícitamente.
- **Hallazgo importante (no se resolvió en esta etapa, requiere decisión):**
  al conectar el registro de Files se descubrió que **PQR y Careers
  Applications siguen 100% en memoria** (`InMemoryPqrRepository`,
  `InMemoryApplicationRepository`) — nunca se migraron a Postgres real,
  a pesar de que la Etapa 3 solo retiró el backend duplicado de Next.js
  (consolidó el *routing*, no la persistencia). Esto significa:
  1. Toda PQR/postulación radicada se pierde en cada reinicio del
     backend (y se ha reiniciado muchas veces esta sesión).
  2. Por eso `entity_id` en `foundation.files` se dejó sin usar para
     estos dos flujos: sus ids son UUID en memoria, no bigint real, y
     la columna es bigint.
  3. Las tablas reales YA EXISTEN y no se usan: `pqr.requests` (+
     `request_types/statuses/priorities/categories/attachments/
     assignments/messages/status_history/slas`, esquema normalizado,
     más rico que la entidad actual — le faltan columnas para
     `documentType`/`documentNumber` que sí tiene la entidad de la app)
     y el schema de careers/jobs (sin revisar todavía en detalle).
  Migrar esto es un trabajo del mismo tamaño que la Etapa 4 (CRM) o la
  Etapa 9 (Blog/Noticias) — mapear el esquema normalizado real,
  decidir qué columnas agregar, sembrar catálogos (tipos/estados/
  prioridades) y reescribir los repositorios. Se documenta aquí como
  pendiente explícito, no se asumió sin confirmar con el usuario.
- **Verificación:** probado en vivo end-to-end (PQR real con adjunto +
  lead público real) — notificación creada para el usuario correcto en
  ambos casos, archivo de PQR registrado en `foundation.files`. Datos y
  archivos de prueba limpiados después.
- **Resultado:** PASS para lo pedido (notificaciones + registro de
  Files). Persistencia real de PQR/Careers queda como pendiente
  identificado, a decidir con el usuario.

---

## 2026-08-31 — Etapa 14 — PQR, Careers Applications y Vacancies → Postgres real

- **Archivo:** `database/migrations/010_pqr_careers_real_persistence.sql`
- **Objetivo:** cerrar el hallazgo de la Etapa 13 — `PqrModule`,
  `ApplicationsModule` y `VacanciesModule` seguían 100% en memoria pese a
  que las tablas reales (`pqr.requests` + 8 catálogos/satélites,
  `careers.job_positions`/`candidates`/`applications` + 8 tablas ATS
  satélite) ya existían sin usar.
- **PQR:** `pqr.requests` — `type_id`/`status_id`/`priority_id` resuelven
  contra los catálogos reales YA sembrados (5 tipos, 8 estados, 4
  prioridades). Se adoptó el set real de 8 estados internamente, pero se
  preservó el contrato de 3 estados que ya usan el admin y el sitio
  público (OPEN/IN_PROGRESS/CLOSED) vía un mapeo bidireccional en el
  repositorio — cero cambios en frontend. Prioridad fija en "MEDIA" (la
  app no modela prioridad todavía). Se agregaron `document_type`/
  `document_number` (sin columna real) y se enlaza el adjunto por FK real
  (`pqr.request_attachments` -> `foundation.files`, no texto plano).
  `company` (texto libre del formulario) resuelve/crea una empresa real
  en `core.companies` (reutiliza `findOrCreateCompanyByName` de CRM).
- **Careers Vacancies:** `careers.job_positions` — mapeo casi 1:1
  (`code`=slug, `work_mode`=modalidad, `status` libre ya que no hay
  catálogo). Se agregó `department` (sin columna real) y `vacancies
  DEFAULT 1`.
- **Careers Applications:** modelo real es un ATS completo
  (`candidates` + `applications`, relación 1 candidato : muchas
  postulaciones vía `job_position_id`+`candidate_id`). Por alcance, esta
  etapa NO deduplica candidato por email (cada postulación sigue creando
  su propia fila de candidato, mismo comportamiento que en memoria) —
  quedaría como mejora futura. `careers.applications.job_position_id` es
  NOT NULL, pero la app permite postulación general sin vacante puntual
  ("Base de Altos Potenciales", sección 23) — mismo patrón que la
  empresa placeholder de CRM (Etapa 4): se creó una **vacante
  placeholder real** (`code='base-altos-potenciales'`, `vacancies=0`,
  nunca se lista como vacante real) para esas postulaciones. Columnas
  nuevas: en `candidates` (`city`, `education_level`, `relocation`,
  `referral_source`, `sectors` JSONB, `salary_expectation_text` — el
  campo es texto libre del formulario, no un número, así que no se forzó
  contra `expected_salary` NUMERIC); en `applications`
  (`experience_range`, evidencia de consentimiento completa
  `consent_policy_version/text/ip/communications/share_cv`, `cv_file_id`
  FK real a `foundation.files`, y `desired_position` — agregada como
  fast-follow en la misma sesión para preservar el "cargo aspirado" en
  texto libre de las postulaciones generales).
- **Verificación:** `database/migrations/010_pqr_careers_real_persistence_verify.sql`
  / `.out.txt` — columnas confirmadas, catálogos de PQR intactos. Prueba
  funcional end-to-end en vivo: PQR real con adjunto (radicado real,
  consulta pública y admin funcionando), vacante real creada y listada
  públicamente de inmediato, postulación con vacante puntual (vacancyId
  real, toda la evidencia de consentimiento y campos ricos preservados,
  CV enlazado por FK) y postulación general (cae al placeholder
  correctamente, cargo en texto libre preservado) — ambas generaron
  notificación real. Todo limpiado después de verificar.
- **Resultado:** PASS. Los 3 módulos quedaron migrados de `InMemory*` a
  `Prisma*` real — ya no queda ningún módulo público-facing en memoria.
  Reversible: `DROP` de las columnas y la vacante placeholder agregadas,
  si hiciera falta (ninguna tabla ni fila existente se tocó).

---

## 2026-08-31 — Etapa 15 — Deduplicar candidatos de Careers + fix de import de Prisma

- **Sin migración propia** (no toca esquema). Dos cambios de código:
  1. `PrismaApplicationRepository.create()` ya no crea un candidato nuevo
     en cada postulación: busca uno existente por correo (case-insensitive)
     y, si existe, actualiza sus datos con lo último enviado y lo reutiliza;
     solo crea uno nuevo si no existía. Como `careers.applications` tiene
     `UNIQUE(candidate_id, job_position_id)` (afecta también a la vacante
     placeholder de la Base de Altos Potenciales), una re-postulación del
     mismo candidato a la misma vacante (o de nuevo sin vacante puntual) ya
     no falla por la restricción única: se captura el error P2002 y se
     actualiza la postulación existente en su lugar (estado, CV, evidencia
     de consentimiento, `applied_at`) — se trata como re-postulación, no
     como error ni duplicado.
  2. **Bug real encontrado al probar el punto anterior:** el `catch` para
     P2002 nunca coincidía y el error se propagaba como 500. Causa:
     `prisma-application.repository.ts` importaba `Prisma` desde
     `@prisma/client`, pero el cliente real del proyecto se genera en una
     carpeta propia (`prisma/generated`, cambio reciente de otra sesión,
     commit "Configura Prisma y persistencia PostgreSQL") — son dos
     instancias de módulo distintas, así que `instanceof
     Prisma.PrismaClientKnownRequestError` daba `false` aunque el error sí
     fuera ese. Se corrigió el import al cliente real. Los demás usos de
     `Prisma` en el proyecto (`Prisma.JsonValue`/`InputJsonValue` en 3
     archivos) son solo tipos, no valores en runtime — no les afectaba el
     mismo problema, se revisaron y se dejaron igual.
  - También se descubrió (y se dejó documentado, no resuelto) que
    `prisma/generated` no existía en este entorno tras el cambio de
    configuración — se regeneró (`npx prisma generate`) y se agregó
    `"postinstall": "prisma generate"` a `backend/package.json` para que
    no vuelva a faltar tras un `npm install` fresco.
- **Verificación:** probado en vivo — dos postulaciones seguidas con el
  mismo correo (sin vacante puntual, mismo escenario que activa la
  restricción única contra la vacante placeholder) resultaron en **una
  sola fila** de candidato y **una sola fila** de postulación, con los
  datos actualizados a lo último enviado (ciudad, cargo aspirado, CV).
  Se encontró de paso que el archivo del CV anterior queda huérfano en
  `foundation.files` cuando se reemplaza en una re-postulación (no se
  borra automáticamente) — limpieza de archivos huérfanos queda como
  mejora menor pendiente, no bloqueante. Datos y archivos de prueba
  limpiados después.
- **Resultado:** PASS.

---

## 2026-11-04 — Bootstrap de catálogos del CRM

- **Archivos:** `database/migrations/015_crm_catalog_bootstrap.sql` y
  `015_crm_catalog_bootstrap_verify.sql`. Guía en
  `database/docs/CRM_PRODUCTION_BOOTSTRAP.md`.
- **Motivo:** en producción, Yuri respondía HTTP 200 pero no podía registrar leads porque
  `crm.lead_sources`, `crm.lead_statuses`, `crm.pipelines` y `crm.pipeline_stages` estaban
  vacías y faltaba la empresa técnica. El esquema se creó con un volcado sin datos y ninguna
  migración definía esos catálogos: en desarrollo se habían cargado a mano (la 003 solo agregaba
  4 fuentes y daba por hecho el resto).
- **Estado en producción:** la recuperación manual ya dejó los registros. Este archivo **todavía
  no se ha ejecutado en producción**; ahí debería ser una ejecución sin cambios. Ningún paso de
  este trabajo tocó la base remota.
- **Cambio:** solo `INSERT`, en una transacción e idempotente. 14 fuentes, 10 estados, pipeline
  predeterminado "Ventas", 5 etapas, país CO y empresa técnica. Sin DDL, sin `UPDATE`, sin
  `DELETE`, sin datos de demostración. Se detiene con un error descriptivo ante estados
  contradictorios (varios predeterminados, otro predeterminado, etapas duplicadas o con
  indicadores distintos, empresa técnica duplicada).
- **Diferencia detectada:** la base de desarrollo tiene 7 etapas (Propuesta y Negociación además
  de las requeridas), con Ganado=6 y Perdido=7. La referencia de producción es Perdido=4 y
  Ganado=5. No es un error: el código localiza las etapas por nombre. La migración no las
  modifica y el verificador solo avisa.
- **Código:** catálogo único en `crm-catalog.json`; creación de empresa, contacto y lead en una
  transacción; un lead por sesión también con peticiones simultáneas; `chat_sessions.lead_id`
  enlazado; contactos sin empresa en la empresa técnica; `SEED_ADMIN_*` sin valores por defecto;
  registros sin datos personales.
- **Verificador:** `verify-deploy.js` comprueba el catálogo en `preflight` y `postflight`, y en
  el modo nuevo `crm`.
- **Pruebas:** `npm test` sobre bases desechables en PostgreSQL 17 local. Ensayo con
  `ROLLBACK` sobre `jud_platform_dev`, sin cambios. **Pendiente:** primera ejecución real en
  PostgreSQL 10, que será el ensayo en el servidor.
- **Pendiente detectado:** la empresa propia (`ownCompany` en `crm-catalog.json`) no tiene
  migración, a propósito: insertarla podría duplicar una empresa real con otro nombre legal. Sin
  ella fallan las postulaciones, los adjuntos de PQR y la carga de imágenes. El verificador avisa
  si falta.
- **Reversión:** no suele hacer falta: es aditiva y el código anterior la ignora. Restaurar la
  copia de seguridad solo si fuera imprescindible.

---

## 2026-11-04 — Bootstrap de catálogos de PQR, chat y almacenamiento

- **Archivos:** `database/migrations/016_platform_catalog_bootstrap.sql` y
  `016_platform_catalog_bootstrap_verify.sql`.
- **Motivo:** misma causa que la 015, encontrada al auditarla. El código usa estos catálogos, pero
  ninguna migración los definía. Sin `pqr.request_types`, `request_statuses` y `request_priorities`
  la radicación de PQR falla.
- **Estado:** **no se ha ejecutado en ninguna base**, ni en producción ni en desarrollo. Se desconoce
  si producción ya tiene estos catálogos: el verificador lo indicará.
- **Cambio:** solo `INSERT`, en una transacción e idempotente. 5 tipos y 8 estados de PQR, 4
  prioridades, 13 intenciones del chat y un proveedor de almacenamiento `Local Storage`, este último
  solo si la tabla está vacía y sin ruta ni bucket. Valores tomados de la base de desarrollo.
- **Pruebas:** `npm test`, sobre bases desechables en PostgreSQL 17 local. Comprueba que una PQR falla
  sin catálogos y se radica tras aplicarla, sin reiniciar.
- **Reversión:** no suele hacer falta: es aditiva y el código anterior la ignora.
