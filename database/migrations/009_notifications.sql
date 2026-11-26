-- ============================================================================
-- ETAPA 11 — Auditoría real + Notifications
-- Proyecto : Capital Consulting and Services S.A.S.
-- Archivo  : 009_notifications.sql
-- Objetivo : crear `foundation.notifications` — no existía ninguna tabla de
--            notificaciones en toda la base (a diferencia de Files/Settings,
--            que ya existían sin usarse). Módulo mínimo pero real: cada
--            módulo puede crear notificaciones para un usuario
--            (`NotificationsService.create()`), el usuario las lista, marca
--            como leídas.
--
-- Seguridad de la operación: solo CREATE TABLE. No se toca ninguna fila ni
-- tabla existente.
-- ============================================================================

BEGIN;

CREATE TABLE foundation.notifications (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid        UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id     BIGINT NOT NULL REFERENCES security.users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  message     TEXT,
  type        VARCHAR(20) NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO','SUCCESS','WARNING','ERROR')),
  link        VARCHAR(300),
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE foundation.notifications IS 'Notificaciones internas por usuario (sección 42 del encargo) — Etapa 11, tabla nueva, no existía ninguna.';

CREATE INDEX idx_notifications_user_unread ON foundation.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON foundation.notifications(created_at);

-- Permisos nuevos: foundation.files.*, foundation.settings.*, notifications
-- son de lectura implícita para el propio usuario (sin permission_key —
-- cada quien ve solo las suyas), solo se protege administración de Files/Settings.
INSERT INTO security.permissions (module, resource, action, permission_key, description) VALUES
  ('foundation', 'files',        'read',   'foundation.files.read',    'Ver archivos subidos'),
  ('foundation', 'files',        'create', 'foundation.files.create',  'Subir archivos'),
  ('foundation', 'files',        'delete', 'foundation.files.delete',  'Eliminar archivos'),
  ('foundation', 'settings',     'read',   'foundation.settings.read',   'Ver configuración del sistema'),
  ('foundation', 'settings',     'update', 'foundation.settings.update', 'Editar configuración del sistema');

-- Administrador: acceso total -> recibe los 5 permisos nuevos.
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r
CROSS JOIN security.permissions p
WHERE r.name = 'Administrador'
  AND p.permission_key IN (
    'foundation.files.read','foundation.files.create','foundation.files.delete',
    'foundation.settings.read','foundation.settings.update'
  );

COMMIT;
