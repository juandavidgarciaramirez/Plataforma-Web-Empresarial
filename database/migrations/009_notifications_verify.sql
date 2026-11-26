-- Verificación de sólo lectura de 009_notifications.sql.

SELECT table_name FROM information_schema.tables WHERE table_schema = 'foundation' AND table_name = 'notifications';
SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'foundation' AND table_name = 'notifications' ORDER BY ordinal_position;

SELECT permission_key FROM security.permissions WHERE permission_key LIKE 'foundation.%' ORDER BY permission_key;
SELECT count(*) AS permisos_admin FROM security.role_permissions rp
JOIN security.roles r ON r.id = rp.role_id
JOIN security.permissions p ON p.id = rp.permission_id
WHERE r.name = 'Administrador' AND p.permission_key LIKE 'foundation.%';

-- Nada existente debe haberse alterado.
SELECT count(*) AS total_files FROM foundation.files;
SELECT count(*) AS total_settings FROM foundation.system_settings;
