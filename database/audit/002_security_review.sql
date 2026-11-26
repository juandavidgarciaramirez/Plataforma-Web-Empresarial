-- ============================================================================
-- ETAPA 2 — SECURITY — auditoría fina (solo lectura)
-- No crea, no modifica. Verifica que lo ya construido cumpla el mínimo
-- exigido por el encargo (sección 14) antes de decidir si falta algo.
-- ============================================================================
\pset pager off
\pset border 2

\echo '=== A. Tablas security vs lista minima exigida ==='
WITH required(t) AS (
  VALUES ('users'),('roles'),('permissions'),('role_permissions'),
         ('positions'),('sessions'),('password_resets'),
         ('email_verifications'),('login_attempts'),('api_clients')
)
SELECT r.t AS required_table,
       CASE WHEN pt.tablename IS NULL THEN 'FALTA' ELSE 'OK' END AS status
FROM required r
LEFT JOIN pg_tables pt ON pt.schemaname = 'security' AND pt.tablename = r.t
ORDER BY r.t;

\echo '=== B. Cada tabla de security: PK, UUID, timestamps, soft delete ==='
SELECT c.relname AS table_name,
       bool_or(a.attname = 'id') AS has_id_pk,
       bool_or(a.attname = 'uuid') AS has_uuid,
       bool_or(a.attname = 'created_at') AS has_created_at,
       bool_or(a.attname = 'updated_at') AS has_updated_at,
       bool_or(a.attname = 'deleted_at') AS has_soft_delete
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'security'
JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped
WHERE c.relkind = 'r'
GROUP BY c.relname
ORDER BY c.relname;

\echo '=== C. Password hashing: tipo y longitud de password_hash ==='
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'security' AND column_name ILIKE '%password%';

\echo '=== D. Emails: hay UNIQUE case-insensitive? ==='
SELECT indexname, indexdef FROM pg_indexes
WHERE schemaname = 'security' AND tablename = 'users' AND indexdef ILIKE '%email%';

\echo '=== E. Roles actuales (no tocar) ==='
SELECT id, name, is_system, is_active FROM security.roles ORDER BY id;

\echo '=== F. Conteo de permisos por rol (sanity check de integridad) ==='
SELECT r.name AS role, count(rp.permission_id) AS permission_count
FROM security.roles r
LEFT JOIN security.role_permissions rp ON rp.role_id = r.id
GROUP BY r.name
ORDER BY r.name;

\echo '=== G. Usuarios actuales (sin exponer password_hash) ==='
SELECT id, uuid, role_id, position_id, first_name, last_name, email, status, email_verified, two_factor_enabled, created_at
FROM security.users ORDER BY id;

\echo '=== H. api_clients actuales (sin exponer client_secret) ==='
SELECT id, name, is_active, rate_limit_per_hour, expires_at, created_at
FROM security.api_clients ORDER BY id;

\echo '=== I. Huerfanos: role_permissions -> roles/permissions ==='
SELECT count(*) AS orphan_role_permissions
FROM security.role_permissions rp
WHERE NOT EXISTS (SELECT 1 FROM security.roles r WHERE r.id = rp.role_id)
   OR NOT EXISTS (SELECT 1 FROM security.permissions p WHERE p.id = rp.permission_id);

\echo '=== J. Huerfanos: users -> roles/positions ==='
SELECT count(*) AS orphan_users
FROM security.users u
WHERE NOT EXISTS (SELECT 1 FROM security.roles r WHERE r.id = u.role_id)
   OR (u.position_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM security.positions p WHERE p.id = u.position_id));

\echo '=== K. Permisos duplicados (mismo permission_key) ==='
SELECT permission_key, count(*) FROM security.permissions GROUP BY permission_key HAVING count(*) > 1;

\echo '=== L. Roles duplicados (mismo name) ==='
SELECT name, count(*) FROM security.roles GROUP BY name HAVING count(*) > 1;

\echo '=== FIN ETAPA 2 ==='
