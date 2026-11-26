-- ============================================================================
-- ETAPA 9 — Conectar Blog y Noticias al sitio público
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 008_blog_news_content.sql
-- Objetivo : ampliar `content.posts` para poder representar sin pérdida de
--            fidelidad el contenido real de `src/data/blog.ts` y
--            `src/data/news.ts` (bloques estructurados, conclusión, CTA,
--            SEO, autor con foto) — el modelo anterior (Etapa 5) solo tenía
--            `content` como texto plano, insuficiente para ese contenido.
--
-- Se agregan columnas nuevas y opcionales; `content` (texto plano) se deja
-- intacta como respaldo, para integraciones que aún no entiendan bloques.
-- `content_blocks` es la fuente real que usa el sitio.
--
-- Seguridad de la operación: solo ALTER TABLE ADD COLUMN. No se toca
-- ninguna fila existente (content.posts seguía en 0 filas desde la Etapa 5).
-- ============================================================================

BEGIN;

ALTER TABLE content.posts
  ADD COLUMN subtitle          TEXT,
  ADD COLUMN image_alt         TEXT,
  ADD COLUMN content_blocks    JSONB,
  ADD COLUMN conclusion        JSONB,
  ADD COLUMN cta_label         VARCHAR(200),
  ADD COLUMN cta_href          VARCHAR(300),
  ADD COLUMN seo_title         VARCHAR(300),
  ADD COLUMN seo_description   TEXT,
  ADD COLUMN author_role       VARCHAR(200),
  ADD COLUMN author_image_url  TEXT,
  ADD COLUMN tags              JSONB,
  ADD COLUMN is_featured       BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN content.posts.content_blocks IS 'Contenido real estructurado ([{type:paragraph|heading|list|note, text/items}]) - Etapa 9. La columna content (texto plano) se conserva como respaldo.';
COMMENT ON COLUMN content.posts.conclusion IS 'Lista de 2-4 ideas de cierre (solo Blog).';
COMMENT ON COLUMN content.posts.tags IS 'Lista de tags (solo Blog).';

COMMIT;
