-- ============================================================================
-- ETAPA 15 — Gestión de imágenes del panel + Analítica web
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 014_media_and_web_analytics.sql
-- Objetivo :
--   1) Imágenes administrables para Noticias, Blog, Servicios, Vacantes,
--      Equipo y la sección pública "Trabaja con nosotros", reutilizando el
--      registro central de archivos que ya existía (`foundation.files`).
--   2) Esquema nuevo `analytics` para la medición propia del sitio público
--      (páginas vistas, sesiones, visitantes seudónimos y eventos).
--
-- Compatibilidad: escrito para PostgreSQL 10 (versión de producción — ver
-- backend/database-production-pg10.sql): sin columnas generadas, sin
-- `date_trunc(..., tz)`, sin procedimientos ni índices con INCLUDE.
--
-- Seguridad de la operación: toda la migración corre en una sola transacción
-- (si algo falla, no queda nada aplicado). Solo CREATE SCHEMA/TABLE/INDEX IF NOT EXISTS,
-- ALTER TABLE ADD COLUMN IF NOT EXISTS e INSERT ... ON CONFLICT DO NOTHING.
-- Ninguna tabla, fila ni imagen existente se borra, renombra ni modifica:
-- los registros actuales (con rutas estáticas `/images/...`) siguen igual.
-- Es idempotente: puede ejecutarse dos veces sin error.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. foundation.files — dimensiones de las imágenes subidas.
--    (El resto de metadatos — nombre original, MIME, tamaño, ruta, URL
--    pública, quién subió, fecha — ya existían en la tabla.)
-- ----------------------------------------------------------------------------
ALTER TABLE foundation.files ADD COLUMN IF NOT EXISTS width  INTEGER;
ALTER TABLE foundation.files ADD COLUMN IF NOT EXISTS height INTEGER;

-- ----------------------------------------------------------------------------
-- 2. foundation.file_links — qué contenido usa cada archivo y en qué rol.
--    Un mismo archivo puede estar enlazado desde varios contenidos: solo se
--    elimina físicamente cuando ya no le queda ningún enlace (sin huérfanos
--    y sin borrar archivos compartidos).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS foundation.file_links (
  id           BIGSERIAL    PRIMARY KEY,
  file_id      BIGINT       NOT NULL REFERENCES foundation.files(id) ON DELETE CASCADE,
  -- news | blog | services | vacancies | team | careers_page
  entity_type  VARCHAR(50)  NOT NULL,
  entity_id    BIGINT       NOT NULL,
  -- cover | gallery | photo | hero | talent | growth
  slot         VARCHAR(30)  NOT NULL,
  alt_text     VARCHAR(300),
  sort_order   SMALLINT     NOT NULL DEFAULT 0,
  created_by   BIGINT       REFERENCES security.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT uk_file_link UNIQUE (entity_type, entity_id, slot, file_id)
);

CREATE INDEX IF NOT EXISTS idx_file_links_entity ON foundation.file_links (entity_type, entity_id, slot);
CREATE INDEX IF NOT EXISTS idx_file_links_file   ON foundation.file_links (file_id);

-- ----------------------------------------------------------------------------
-- 3. Columnas de imagen principal en los contenidos que no tenían.
--    `content.posts` ya tenía cover_image_url / image_alt /
--    featured_image_file_id y `content.team_members` ya tenía photo_url.
-- ----------------------------------------------------------------------------
ALTER TABLE catalog.services       ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE catalog.services       ADD COLUMN IF NOT EXISTS image_alt VARCHAR(300);
ALTER TABLE careers.job_positions  ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE careers.job_positions  ADD COLUMN IF NOT EXISTS image_alt VARCHAR(300);
ALTER TABLE content.team_members   ADD COLUMN IF NOT EXISTS photo_alt VARCHAR(300);

-- ----------------------------------------------------------------------------
-- 4. Esquema `analytics` — medición propia del sitio público.
--    Privacidad: no se guarda IP, nombre, correo, teléfono ni contenido de
--    formularios. `visitor_id`/`session_id` son UUID aleatorios generados en
--    el navegador SOLO si el visitante aceptó cookies analíticas; sin ese
--    consentimiento las páginas vistas se registran sin identificador.
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.visitors (
  id             UUID         PRIMARY KEY,
  first_seen_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  last_seen_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_last_seen ON analytics.visitors (last_seen_at);

CREATE TABLE IF NOT EXISTS analytics.sessions (
  id                UUID         PRIMARY KEY,
  visitor_id        UUID         NOT NULL REFERENCES analytics.visitors(id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  last_activity_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  pageviews         INTEGER      NOT NULL DEFAULT 0,
  events            INTEGER      NOT NULL DEFAULT 0,
  conversions       INTEGER      NOT NULL DEFAULT 0,
  entry_path        VARCHAR(300),
  exit_path         VARCHAR(300),
  channel           VARCHAR(30)  NOT NULL DEFAULT 'direct'
);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started ON analytics.sessions (started_at);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_visitor ON analytics.sessions (visitor_id);

CREATE TABLE IF NOT EXISTS analytics.events (
  id             BIGSERIAL    PRIMARY KEY,
  occurred_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  event_type     VARCHAR(10)  NOT NULL,
  event_name     VARCHAR(60),
  is_conversion  BOOLEAN      NOT NULL DEFAULT false,
  path           VARCHAR(300) NOT NULL,
  -- NULL = visitante sin consentimiento analítico (registro anónimo)
  visitor_id     UUID,
  session_id     UUID,
  -- primera página vista de una llegada al sitio (visita)
  is_entrance    BOOLEAN      NOT NULL DEFAULT false,
  -- atribución de la visita en curso (para fuentes y conversiones por canal)
  channel        VARCHAR(30)  NOT NULL DEFAULT 'direct',
  referrer_host  VARCHAR(200),
  utm_source     VARCHAR(100),
  utm_medium     VARCHAR(100),
  utm_campaign   VARCHAR(150),
  utm_term       VARCHAR(150),
  utm_content    VARCHAR(150),
  device_type    VARCHAR(20),
  browser        VARCHAR(40),
  os             VARCHAR(40),
  country        VARCHAR(2),
  region         VARCHAR(100),
  props          JSONB,
  CONSTRAINT ck_analytics_event_type CHECK (event_type IN ('pageview', 'event'))
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_time      ON analytics.events (occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time ON analytics.events (event_type, occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session   ON analytics.events (session_id);

-- ----------------------------------------------------------------------------
-- 5. foundation.rate_limit_counters — contador atómico de rate limiting,
--    compartido entre las instancias de Passenger (ver
--    backend/src/common/throttler/postgres-throttler.storage.ts). UNLOGGED: los
--    datos son descartables y viven minutos; evita escribir en el WAL por cada
--    petición. La clave es un HMAC: aquí no se guarda ninguna IP.
-- ----------------------------------------------------------------------------
CREATE UNLOGGED TABLE IF NOT EXISTS foundation.rate_limit_counters (
  counter_key  CHAR(64)     PRIMARY KEY,
  hits         INTEGER      NOT NULL DEFAULT 1,
  expires_at   TIMESTAMPTZ  NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. Permisos del panel de analítica. Se REUTILIZAN las claves que ya traía
--    el catálogo original de `security.permissions` (analytics.dashboard.read
--    y analytics.reports.export, sin uso hasta ahora); el INSERT solo las crea
--    en bases donde no existan (p. ej. una base sembrada solo con
--    production-seed.ts).
-- ----------------------------------------------------------------------------
INSERT INTO security.permissions (module, resource, action, permission_key, description) VALUES
  ('analytics', 'dashboard', 'read',   'analytics.dashboard.read', 'Ver el panel de Analítica web'),
  ('analytics', 'reports',   'export', 'analytics.reports.export', 'Exportar informes de Analítica web en CSV')
ON CONFLICT (permission_key) DO NOTHING;

-- Administrador (acceso total) y Comercial (decisiones comerciales y de
-- marketing) reciben ambos permisos. El resto de roles no cambia.
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name IN ('Administrador', 'Comercial')
  AND p.permission_key IN ('analytics.dashboard.read', 'analytics.reports.export')
ON CONFLICT (role_id, permission_id) DO NOTHING;

COMMIT;
