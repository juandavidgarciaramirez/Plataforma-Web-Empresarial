-- ============================================================================
-- ETAPA 2 — SECURITY (catálogo)
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 002_security_catalog.sql
-- Objetivo : completar el catálogo real de `security.permissions` y
--            `security.roles` para que cubra los módulos que el backend
--            NestJS ya implementa en código (CRM: opportunities/pipeline/
--            tasks/activities/leads.assign/leads.convert; CMS: team/news;
--            gestión de roles; auditoría) y agregar los 2 roles del encargo
--            que todavía no existen (RRHH, Soporte) — SIN tocar ni borrar
--            ninguna de las 44 filas de permisos ni los 5 roles reales que
--            ya existían (decisión registrada: "conservar los 5 reales +
--            agregar HR y Soporte", ver docs/backend-audit.md).
--
-- Convención de permission_key adoptada (decisión del encargo): se sigue el
-- formato real de 3 partes YA usado por las 44 filas existentes
-- (`modulo.recurso.accion`), en vez de introducir el formato de 2 partes
-- que traía el código NestJS (`recurso.accion`). El código se adapta a la
-- base de datos real, no al revés (sección 6 del encargo).
--
-- Esta migración NO crea usuarios ni contraseñas (sin secretos en SQL
-- versionado). El usuario SUPER_ADMIN real de Capital Consulting lo crea
-- `SeedService` al arrancar el backend, leyendo SEED_ADMIN_EMAIL /
-- SEED_ADMIN_PASSWORD desde `.env` (no versionado) — ver Etapa 2 en
-- database/docs/MIGRATION_LOG.md. Los 2 usuarios de plantilla existentes
-- (`admin@judplatform.com`, `adminin`) se dejan intactos, sin modificar.
--
-- Seguridad de la operación: solo INSERT (ninguna fila existente se borra,
-- actualiza ni renombra). Reversible con DELETE por permission_key/role
-- name si hiciera falta.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Permisos nuevos (32) — mismo patrón que los 44 existentes.
-- ----------------------------------------------------------------------------
INSERT INTO security.permissions (module, resource, action, permission_key, description) VALUES
  ('security', 'roles',         'read',         'security.roles.read',           'Ver roles del sistema'),
  ('security', 'roles',         'create',       'security.roles.create',         'Crear roles nuevos'),
  ('security', 'roles',         'update',       'security.roles.update',         'Editar roles existentes'),
  ('security', 'roles',         'delete',       'security.roles.delete',         'Eliminar roles (no aplica a roles de sistema)'),

  ('crm',      'tasks',         'read',         'crm.tasks.read',                'Ver tareas del CRM'),
  ('crm',      'tasks',         'create',       'crm.tasks.create',              'Crear tareas del CRM'),
  ('crm',      'tasks',         'update',       'crm.tasks.update',              'Editar tareas del CRM'),
  ('crm',      'tasks',         'assign',       'crm.tasks.assign',              'Asignar tareas a un responsable'),
  ('crm',      'tasks',         'delete',       'crm.tasks.delete',              'Eliminar tareas del CRM'),

  ('crm',      'pipeline',      'read',         'crm.pipeline.read',             'Ver el pipeline comercial'),

  ('crm',      'opportunities', 'read',         'crm.opportunities.read',        'Ver oportunidades del CRM'),
  ('crm',      'opportunities', 'create',       'crm.opportunities.create',      'Crear oportunidades'),
  ('crm',      'opportunities', 'update',       'crm.opportunities.update',      'Editar oportunidades'),
  ('crm',      'opportunities', 'assign',       'crm.opportunities.assign',      'Asignar oportunidades a un responsable'),
  ('crm',      'opportunities', 'change_stage', 'crm.opportunities.change_stage','Cambiar la etapa de una oportunidad'),
  ('crm',      'opportunities', 'close',        'crm.opportunities.close',       'Cerrar una oportunidad (ganada/perdida)'),
  ('crm',      'opportunities', 'delete',       'crm.opportunities.delete',      'Eliminar oportunidades'),

  ('crm',      'activities',    'read',         'crm.activities.read',           'Ver actividades del CRM'),
  ('crm',      'activities',    'create',       'crm.activities.create',         'Registrar actividades del CRM'),
  ('crm',      'activities',    'update',       'crm.activities.update',         'Editar actividades del CRM'),
  ('crm',      'activities',    'delete',       'crm.activities.delete',         'Eliminar actividades del CRM'),

  ('crm',      'leads',         'assign',       'crm.leads.assign',              'Asignar leads a un responsable'),
  ('crm',      'leads',         'convert',      'crm.leads.convert',             'Convertir un lead en oportunidad'),

  ('cms',      'team',          'read',         'cms.team.read',                 'Ver miembros del equipo'),
  ('cms',      'team',          'create',       'cms.team.create',               'Crear miembros del equipo'),
  ('cms',      'team',          'update',       'cms.team.update',               'Editar miembros del equipo'),
  ('cms',      'team',          'delete',       'cms.team.delete',               'Eliminar miembros del equipo'),

  ('cms',      'news',          'read',         'cms.news.read',                 'Ver noticias'),
  ('cms',      'news',          'create',       'cms.news.create',               'Crear noticias'),
  ('cms',      'news',          'update',       'cms.news.update',               'Editar noticias'),
  ('cms',      'news',          'delete',       'cms.news.delete',               'Eliminar noticias'),

  ('audit',    'logs',          'read',         'audit.logs.read',               'Ver el registro de auditoría');

-- ----------------------------------------------------------------------------
-- 2. Roles nuevos (2) — mismo patrón que los 5 existentes (español, is_system).
-- ----------------------------------------------------------------------------
INSERT INTO security.roles (name, description, is_system, is_active) VALUES
  ('Recursos Humanos', 'Gestión de talento humano: convocatorias y postulaciones.', true, true),
  ('Soporte',          'Atención de PQR.',                                          true, true);

-- ----------------------------------------------------------------------------
-- 3. Complementar permisos de roles existentes (solo agrega, no quita nada).
-- ----------------------------------------------------------------------------

-- Administrador: acceso total -> recibe también los 32 permisos nuevos.
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Administrador'
  AND p.permission_key IN (
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
  );

-- Editor: ya gestiona blog/pages/services -> se le suma team y news (mismo
-- alcance de "gestión de contenido" que ya tenía, extendido a los tipos de
-- contenido nuevos que el backend NestJS ya implementa).
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Editor'
  AND p.permission_key IN (
    'cms.team.read','cms.team.create','cms.team.update','cms.team.delete',
    'cms.news.read','cms.news.create','cms.news.update','cms.news.delete'
  );

-- Comercial: ya gestiona leads/companies/contacts -> se le suma el resto del
-- CRM (opportunities, pipeline, tasks, activities, assign/convert de leads).
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Comercial'
  AND p.permission_key IN (
    'crm.leads.assign','crm.leads.convert',
    'crm.opportunities.read','crm.opportunities.create','crm.opportunities.update','crm.opportunities.assign',
    'crm.opportunities.change_stage','crm.opportunities.close','crm.opportunities.delete',
    'crm.pipeline.read',
    'crm.tasks.read','crm.tasks.create','crm.tasks.update','crm.tasks.assign','crm.tasks.delete',
    'crm.activities.read','crm.activities.create','crm.activities.update','crm.activities.delete'
  );

-- Recursos Humanos: convocatorias (jobs.vacancies) + lectura de usuarios.
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Recursos Humanos'
  AND p.permission_key IN ('jobs.vacancies.read','jobs.vacancies.create','jobs.vacancies.update','security.users.read');

-- Soporte: atención de PQR (lectura y actualización de tickets).
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Soporte'
  AND p.permission_key IN ('pqrs.tickets.read','pqrs.tickets.update');

-- Nota: el rol "Cliente" (portal cliente) y "Visitante" (usuario público) NO
-- se tocan en esta etapa — no hay código en el backend todavía que dependa
-- de sus permisos, y extender "Visitante" a lectura global contradiría su
-- descripción real ("Usuario público"). Queda documentado como decisión
-- pendiente en docs/backend-audit.md, no se asume.

COMMIT;
