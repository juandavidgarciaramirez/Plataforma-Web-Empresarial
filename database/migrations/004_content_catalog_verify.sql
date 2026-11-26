-- Verificación de sólo lectura de 004_content_catalog.sql.

SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns
WHERE table_schema = 'content' AND table_name = 'posts' AND column_name IN ('post_type', 'cover_image_url', 'author_name');

SELECT table_name FROM information_schema.tables WHERE table_schema = 'content' AND table_name = 'team_members';

SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'content' AND table_name = 'team_members' ORDER BY ordinal_position;

SELECT code, name, is_active, is_featured, sort_order FROM catalog.services ORDER BY is_active DESC, sort_order;

SELECT count(*) AS total_services FROM catalog.services;
SELECT count(*) AS servicios_reales_activos FROM catalog.services WHERE is_active = true;

-- Nada existente debe haberse perdido.
SELECT count(*) AS total_posts FROM content.posts;
