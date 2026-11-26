-- Verificación de sólo lectura de 002_security_catalog.sql.

-- Total de permisos (esperado: 44 + 32 = 76).
SELECT count(*) AS total_permissions FROM security.permissions;

-- Total de roles (esperado: 5 + 2 = 7).
SELECT count(*) AS total_roles FROM security.roles;

-- Permisos nuevos, uno por uno (esperado: 32 filas, ninguna nula).
SELECT permission_key FROM security.permissions
WHERE permission_key IN (
  'security.roles.read','security.roles.create','security.roles.update','security.roles.delete',
  'crm.tasks.read','crm.tasks.create','crm.tasks.update','crm.tasks.assign','crm.tasks.delete',
  'crm.pipeline.read',
  'crm.opportunities.read','crm.opportunities.create','crm.opportunities.update','crm.opportunities.assign',
  'crm.opportunities.change_stage','crm.opportunities.close','crm.opportunities.delete',
  'crm.activities.read','crm.activities.create','crm.activities.update','crm.activities.delete',
  'crm.leads.assign','crm.leads.convert',
  'cms.team.read','cms.team.create','cms.team.update','cms.team.delete',
  'cms.news.read','cms.news.create','cms.news.update','cms.news.delete',
  'audit.logs.read'
)
ORDER BY 1;

-- Roles nuevos (esperado: Recursos Humanos, Soporte).
SELECT name, description, is_system, is_active FROM security.roles
WHERE name IN ('Recursos Humanos', 'Soporte');

-- Conteo de permisos por rol, después de la migración.
SELECT r.name, count(rp.id) AS total_permisos
FROM security.roles r
LEFT JOIN security.role_permissions rp ON rp.role_id = r.id
GROUP BY r.name
ORDER BY r.name;

-- Los 2 usuarios de plantilla existentes deben seguir intactos (esperado: 2,
-- sin cambios en email/status respecto a la auditoría previa).
SELECT id, email, status, role_id FROM security.users ORDER BY id;

-- No debe haber permission_key duplicadas (esperado: 0 filas).
SELECT permission_key, count(*) FROM security.permissions
GROUP BY permission_key HAVING count(*) > 1;

-- No debe haber nombres de rol duplicados (esperado: 0 filas).
SELECT name, count(*) FROM security.roles
GROUP BY name HAVING count(*) > 1;
