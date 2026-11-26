-- ============================================================================
-- ETAPA 0 — AUDITORÍA DE LÍNEA BASE (solo lectura)
-- Proyecto : Jud Platform
-- Base     : jud_platform_dev
-- Propósito: capturar el estado real de PostgreSQL antes de tocar nada.
-- Este script NO modifica datos ni estructuras (todo SELECT / catálogos).
-- ============================================================================

\pset pager off
\pset border 2

\echo '=== 0. VERSION Y CONEXION ==='
SELECT version();
SELECT current_database() AS database, current_user AS connected_as, now() AS audited_at;
SELECT pg_size_pretty(pg_database_size(current_database())) AS database_size;

\echo '=== 1. ROLES DE POSTGRES (login) ==='
SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolcanlogin
FROM pg_roles
ORDER BY rolname;

\echo '=== 2. EXTENSIONES ==='
SELECT extname, extversion, n.nspname AS schema
FROM pg_extension e
JOIN pg_namespace n ON n.oid = e.extnamespace
ORDER BY extname;

\echo '=== 3. SCHEMAS ==='
SELECT nspname AS schema,
       pg_get_userbyid(nspowner) AS owner
FROM pg_namespace
WHERE nspname NOT LIKE 'pg\_%' AND nspname <> 'information_schema'
ORDER BY nspname;

\echo '=== 4. TABLAS POR SCHEMA ==='
SELECT schemaname AS schema, tablename AS table, tableowner AS owner
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog','information_schema')
ORDER BY schemaname, tablename;

\echo '=== 5. VISTAS ==='
SELECT schemaname AS schema, viewname AS view
FROM pg_views
WHERE schemaname NOT IN ('pg_catalog','information_schema')
ORDER BY schemaname, viewname;

\echo '=== 6. MATERIALIZED VIEWS ==='
SELECT schemaname AS schema, matviewname AS matview
FROM pg_matviews
ORDER BY schemaname, matviewname;

\echo '=== 7. COLUMNAS ==='
SELECT table_schema AS schema, table_name AS table, ordinal_position AS pos,
       column_name, data_type, udt_name,
       is_nullable, column_default,
       character_maximum_length AS max_len,
       numeric_precision, numeric_scale
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog','information_schema')
ORDER BY table_schema, table_name, ordinal_position;

\echo '=== 8. TIPOS ENUM ==='
SELECT n.nspname AS schema, t.typname AS enum_name, e.enumlabel AS value, e.enumsortorder AS sort
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON n.oid = t.typnamespace
ORDER BY schema, enum_name, sort;

\echo '=== 9. COLUMNAS QUE USAN ENUMS (para saber quien depende de cada tipo) ==='
SELECT t.typname AS enum_type, n2.nspname AS enum_schema,
       n.nspname AS table_schema, c.relname AS table_name, a.attname AS column_name
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid AND c.relkind IN ('r','p')
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_type t ON t.oid = a.atttypid
JOIN pg_namespace n2 ON n2.oid = t.typnamespace
WHERE t.typtype = 'e' AND NOT a.attisdropped AND a.attnum > 0
ORDER BY enum_type, table_schema, table_name;

\echo '=== 10. CONSTRAINTS (PK / UNIQUE / CHECK / FK / EXCLUDE) ==='
SELECT n.nspname AS schema, cl.relname AS table_name, con.conname AS constraint_name,
       CASE con.contype
            WHEN 'p' THEN 'PRIMARY KEY'
            WHEN 'u' THEN 'UNIQUE'
            WHEN 'c' THEN 'CHECK'
            WHEN 'f' THEN 'FOREIGN KEY'
            WHEN 'x' THEN 'EXCLUDE'
            ELSE con.contype::text
       END AS constraint_type,
       pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class cl ON cl.oid = con.conrelid
JOIN pg_namespace n ON n.oid = cl.relnamespace
WHERE n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY schema, table_name, constraint_type, constraint_name;

\echo '=== 11. INDICES ==='
SELECT schemaname AS schema, tablename AS table, indexname AS index, indexdef AS definition
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog','information_schema')
ORDER BY schemaname, tablename, indexname;

\echo '=== 12. SEQUENCES ==='
SELECT schemaname AS schema, sequencename AS sequence, data_type,
       start_value, min_value, max_value, increment_by, last_value
FROM pg_sequences
WHERE schemaname NOT IN ('pg_catalog','information_schema')
ORDER BY schemaname, sequencename;

\echo '=== 13. SEQUENCE OWNERSHIP (columna <-> secuencia, via default) ==='
SELECT n.nspname AS schema, c.relname AS table_name, a.attname AS column_name,
       pg_get_serial_sequence(n.nspname || '.' || c.relname, a.attname) AS owned_sequence
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid AND c.relkind IN ('r','p')
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE NOT a.attisdropped AND a.attnum > 0
  AND n.nspname NOT IN ('pg_catalog','information_schema')
  AND pg_get_serial_sequence(n.nspname || '.' || c.relname, a.attname) IS NOT NULL
ORDER BY schema, table_name, column_name;

\echo '=== 14. TRIGGERS ==='
SELECT n.nspname AS schema, c.relname AS table_name, t.tgname AS trigger_name,
       pg_get_triggerdef(t.oid) AS definition
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE NOT t.tgisinternal
  AND n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY schema, table_name, trigger_name;

\echo '=== 15. FUNCIONES / PROCEDIMIENTOS ==='
SELECT n.nspname AS schema, p.proname AS name,
       pg_get_function_identity_arguments(p.oid) AS args,
       CASE p.prokind WHEN 'f' THEN 'FUNCTION' WHEN 'p' THEN 'PROCEDURE' WHEN 'a' THEN 'AGGREGATE' WHEN 'w' THEN 'WINDOW' END AS kind
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY schema, name;

\echo '=== 16. FOREIGN KEYS DETALLADAS (origen -> destino, ON DELETE/UPDATE) ==='
SELECT
    n.nspname AS fk_schema, cl.relname AS fk_table, con.conname AS constraint_name,
    a.attname AS fk_column,
    fn.nspname AS ref_schema, fcl.relname AS ref_table, fa.attname AS ref_column,
    CASE con.confupdtype WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END AS on_update,
    CASE con.confdeltype WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END AS on_delete
FROM pg_constraint con
JOIN pg_class cl ON cl.oid = con.conrelid
JOIN pg_namespace n ON n.oid = cl.relnamespace
JOIN pg_class fcl ON fcl.oid = con.confrelid
JOIN pg_namespace fn ON fn.oid = fcl.relnamespace
JOIN unnest(con.conkey) WITH ORDINALITY AS ck(attnum, ord) ON true
JOIN unnest(con.confkey) WITH ORDINALITY AS fck(attnum, ord) ON fck.ord = ck.ord
JOIN pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = ck.attnum
JOIN pg_attribute fa ON fa.attrelid = con.confrelid AND fa.attnum = fck.attnum
WHERE con.contype = 'f'
  AND n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY fk_schema, fk_table, constraint_name;

\echo '=== 17. ROW COUNTS APROXIMADOS (pg_stat_user_tables) ==='
SELECT schemaname AS schema, relname AS table, n_live_tup AS approx_rows, last_analyze, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY schemaname, relname;

\echo '=== 18. ROW COUNTS EXACTOS (por tabla, dinamico) ==='
SELECT format('SELECT %L AS tbl, count(*) AS exact_rows FROM %I.%I', schemaname || '.' || tablename, schemaname, tablename)
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog','information_schema')
ORDER BY schemaname, tablename
\gexec

\echo '=== 19. TAMAÑO POR TABLA ==='
SELECT n.nspname AS schema, c.relname AS table,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r' AND n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY pg_total_relation_size(c.oid) DESC;

\echo '=== FIN AUDITORIA ETAPA 0 ==='
