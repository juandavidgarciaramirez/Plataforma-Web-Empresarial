-- ============================================================================
-- ETAPA 5 — CONTENT/CMS (catálogo + columnas + tabla nueva)
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 004_content_catalog.sql
-- Objetivo : conectar Blog/Noticias/Servicios/Equipo (hoy en memoria) al
--            esquema real `content`/`catalog`, completando lo que falta,
--            sin tocar ni borrar ninguna fila existente.
--
-- Contexto (igual que en la Etapa 4 con CRM): el esquema `content` ya tenía
-- 12 tablas reales con `posts`+`post_categories`+`post_tags` (un solo tipo
-- de artículo, sin distinguir Blog de Noticias) y `pages`+`page_sections`
-- (constructor de páginas genérico). No existe ninguna tabla de equipo
-- (`team`/`member`/`staff` — se buscó en toda la base). `catalog.services`
-- sí existe pero sus 7 filas son de una plantilla genérica de otro negocio
-- ("Consultoría Empresarial", "Aplicaciones Móviles", "CRM", "Desarrollo
-- Web", "Desarrollo de Software", "Automatización de Procesos",
-- "Transformación Digital") — no son los servicios reales de Capital
-- Consulting, así que no se reutilizan como si lo fueran.
--
-- Decisiones (mismo criterio que las etapas anteriores — real ANTES que
-- esquema perfecto, aditivo, no destructivo):
--   1. `content.posts` gana 3 columnas nuevas en vez de crear una tabla
--      paralela para Noticias: son casi el mismo shape (título/slug/
--      resumen/contenido/categoría/imagen/estado/fecha), así que se
--      distinguen con `post_type` en la misma tabla.
--   2. Tabla nueva `content.team_members` (no existía ninguna).
--   3. `catalog.services`: se agregan las 5 filas reales de Capital
--      Consulting; las 7 de plantilla genérica se desactivan
--      (`is_active=false`, NO se borran) para que no aparezcan en el sitio
--      público si se conecta este catálogo.
--
-- Seguridad de la operación: solo ALTER TABLE ADD COLUMN, CREATE TABLE,
-- INSERT y un UPDATE de un flag (`is_active=false`, reversible). Ninguna
-- fila se borra ni se sobreescribe con datos distintos a los que ya tenía.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. content.posts: Blog vs Noticias + campos que el código ya usa y no
--    tenían columna real (autor como texto libre, imagen como URL directa
--    en vez de un archivo subido — `FileService` todavía no existe).
-- ----------------------------------------------------------------------------
ALTER TABLE content.posts
  ADD COLUMN post_type VARCHAR(10) NOT NULL DEFAULT 'BLOG' CHECK (post_type IN ('BLOG', 'NEWS')),
  ADD COLUMN cover_image_url TEXT,
  ADD COLUMN author_name VARCHAR(150);

CREATE INDEX idx_posts_type ON content.posts(post_type);

COMMENT ON COLUMN content.posts.post_type IS 'Etapa 5: distingue Blog de Noticias dentro de la misma tabla (mismo shape real).';

-- ----------------------------------------------------------------------------
-- 2. content.team_members — no existía ninguna tabla de equipo en la base.
-- ----------------------------------------------------------------------------
CREATE TABLE content.team_members (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid        UUID NOT NULL DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  position    VARCHAR(200) NOT NULL,
  bio         TEXT,
  photo_url   TEXT,
  sort_order  INT NOT NULL DEFAULT 1,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_by  BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  updated_by  BIGINT REFERENCES security.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE content.team_members IS 'Equipo (sección 17 del encargo) — Etapa 5, tabla nueva, no existía.';

CREATE INDEX idx_team_members_active ON content.team_members(is_active);
CREATE INDEX idx_team_members_order ON content.team_members(sort_order);

-- ----------------------------------------------------------------------------
-- 3. catalog.services — agregar los 5 servicios reales; desactivar (no
--    borrar) los 7 de plantilla genérica.
-- ----------------------------------------------------------------------------
UPDATE catalog.services SET is_active = false
WHERE code IN (
  'CONSULTORIA_EMPRESARIAL', 'APLICACIONES_MOVILES', 'CRM', 'DESARROLLO_WEB',
  'DESARROLLO_SOFTWARE', 'AUTOMATIZACION_PROCESOS', 'TRANSFORMACION_DIGITAL'
);

INSERT INTO catalog.services (code, name, short_description, description, is_featured, is_active, sort_order) VALUES
  ('capital-learning', 'Capital Learning',
   'Formación y desarrollo de talento humano.',
   'Programas de formación, capacitación y desarrollo de habilidades para equipos y organizaciones.',
   true, true, 1),
  ('capital-mobility', 'Capital Mobility',
   'Soluciones de movilidad y transporte empresarial.',
   'Gestión y soluciones de movilidad, transporte y seguridad vial para empresas.',
   true, true, 2),
  ('capital-hse', 'Capital SST',
   'Seguridad y Salud en el Trabajo.',
   'Consultoría y gestión integral en Seguridad y Salud en el Trabajo (SST) conforme a la normativa colombiana.',
   true, true, 3),
  ('capital-staffing', 'Capital Talento Humano',
   'Gestión de talento humano y selección de personal.',
   'Procesos de selección, gestión de talento humano y Base de Altos Potenciales para las organizaciones.',
   true, true, 4),
  ('capital-business-services', 'Capital Soluciones Empresariales',
   'Consultoría empresarial integral.',
   'Soluciones y consultoría empresarial integral para la gestión y crecimiento organizacional.',
   true, true, 5);

COMMIT;
