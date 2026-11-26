-- Verificación de sólo lectura de 006_home_about_organigrama.sql.

-- 1. Columnas nuevas en content.team_members
SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'content' AND table_name = 'team_members'
ORDER BY ordinal_position;

-- 2. Tablas nuevas
SELECT table_schema, table_name FROM information_schema.tables
WHERE table_schema = 'content'
  AND table_name IN ('company_profile', 'hero_slides', 'company_values', 'who_we_are_concepts')
ORDER BY table_name;

-- 3. Fila única de company_profile
SELECT id, about_hero_title, about_who_title, mission_vision_is_placeholder,
       home_about_stat1_value, home_about_stat2_value
FROM content.company_profile;

-- 4. Conteos de las listas sembradas
SELECT count(*) AS hero_slides FROM content.hero_slides;
SELECT count(*) AS company_values FROM content.company_values;
SELECT count(*) AS who_we_are_concepts FROM content.who_we_are_concepts;

-- 5. Permisos nuevos y su asignación a roles
SELECT permission_key FROM security.permissions
WHERE permission_key LIKE 'cms.home.%' OR permission_key LIKE 'cms.hero.%'
   OR permission_key LIKE 'cms.values.%' OR permission_key LIKE 'cms.concepts.%'
ORDER BY permission_key;

SELECT r.name AS role, count(*) AS permisos_nuevos_asignados
FROM security.role_permissions rp
JOIN security.roles r ON r.id = rp.role_id
JOIN security.permissions p ON p.id = rp.permission_id
WHERE p.permission_key LIKE 'cms.home.%' OR p.permission_key LIKE 'cms.hero.%'
   OR p.permission_key LIKE 'cms.values.%' OR p.permission_key LIKE 'cms.concepts.%'
GROUP BY r.name
ORDER BY r.name;

-- 6. Nada existente debe haberse alterado: team_members sigue con 0 filas
--    de datos falsos, servicios reales intactos.
SELECT count(*) AS total_team_members FROM content.team_members;
SELECT count(*) AS total_active_services FROM catalog.services WHERE is_active = true;
