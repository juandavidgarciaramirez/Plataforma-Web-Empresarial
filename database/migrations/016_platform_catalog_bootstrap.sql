-- ============================================================================
-- 016 — Bootstrap de catálogos de PQR, chat y almacenamiento
-- Archivo  : database/migrations/016_platform_catalog_bootstrap.sql
-- Verifica : database/migrations/016_platform_catalog_bootstrap_verify.sql
-- Guía     : database/docs/CRM_PRODUCTION_BOOTSTRAP.md
--
-- Por qué existe: misma causa que la 015. El código usa estos catálogos, pero
-- ninguna migración los definía: en desarrollo se habían cargado a mano y una
-- base nueva (solo esquema) los deja vacíos. Sin ellos:
--   * pqr.request_types, request_statuses, request_priorities: la radicación de PQR falla.
--   * chat.chat_intents: Yuri responde, pero sus conversaciones quedan sin intención.
--   * foundation.storage_providers: los archivos quedan sin proveedor registrado.
--
-- Seguridad:
--   * Compatible con PostgreSQL 10.
--   * Una sola transacción: si algo falla no queda nada aplicado.
--   * Idempotente: se puede ejecutar varias veces sin duplicar ni fallar.
--   * Solo INSERT. Sin DDL, UPDATE ni DELETE: las filas existentes no se tocan.
--   * Sin datos de demostración, rutas ni credenciales.
--   * No depende de la 015.
--
-- Los códigos que usa el código están en la sección platformCatalog de
-- backend/src/modules/crm/common/crm-catalog.json (lo comprueba
-- backend/test/crm-catalog-consistency.test.js).
--
-- Ensayo sin dejar cambios:
--   sed -E 's/^COMMIT;\r?$/ROLLBACK;/' 016_platform_catalog_bootstrap.sql | psql "$DB_URL" -v ON_ERROR_STOP=1
-- Aplicar:
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -f 016_platform_catalog_bootstrap.sql
-- ============================================================================

BEGIN;

-- Este archivo está en UTF-8. Sin esto, un cliente con otra codificación insertaría
-- 'PeticiÃ³n' sin ningún error. Se revierte solo al terminar la transacción.
SET LOCAL client_encoding = 'UTF8';

-- No esperar indefinidamente si otra sesión retiene la tabla del punto 5.
SET LOCAL lock_timeout = '15s';

-- ----------------------------------------------------------------------------
-- 1. Tipos de PQR (índice único: request_types_code_key).
-- ----------------------------------------------------------------------------
INSERT INTO pqr.request_types (code, name, description, is_active, sort_order) VALUES
  ('PETICION',     'Petición',     'Solicitud realizada por un ciudadano o cliente.',  true, 1),
  ('QUEJA',        'Queja',        'Manifestación relacionada con una inconformidad.', true, 2),
  ('RECLAMO',      'Reclamo',      'Manifestación relacionada con un incumplimiento.', true, 3),
  ('SUGERENCIA',   'Sugerencia',   'Propuesta de mejora.',                             true, 4),
  ('FELICITACION', 'Felicitación', 'Reconocimiento positivo.',                         true, 5)
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Estados de PQR (índice único: request_statuses_code_key).
-- ----------------------------------------------------------------------------
INSERT INTO pqr.request_statuses (code, name, is_closed, is_active, sort_order) VALUES
  ('RECEIVED',     'Recibida',                            false, true, 1),
  ('UNDER_REVIEW', 'En revisión',                         false, true, 2),
  ('ASSIGNED',     'Asignada',                            false, true, 3),
  ('IN_PROGRESS',  'En gestión',                          false, true, 4),
  ('WAITING_USER', 'Esperando respuesta del solicitante', false, true, 5),
  ('RESPONDED',    'Respondida',                          false, true, 6),
  ('CLOSED',       'Cerrada',                             true,  true, 7),
  ('REJECTED',     'Rechazada',                           true,  true, 8)
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Prioridades de PQR (índice único: request_priorities_code_key).
-- ----------------------------------------------------------------------------
INSERT INTO pqr.request_priorities (code, name, level, is_active) VALUES
  ('LOW',    'Baja',    1, true),
  ('MEDIUM', 'Media',   2, true),
  ('HIGH',   'Alta',    3, true),
  ('URGENT', 'Urgente', 4, true)
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. Intenciones del chat (índice único: chat_intents_code_key).
-- ----------------------------------------------------------------------------
INSERT INTO chat.chat_intents (code, name, description, is_active) VALUES
  ('GREETING',           'Saludo',               'Saludo inicial o conversación social.',             true),
  ('SERVICE_INQUIRY',    'Consulta de servicio', 'Consulta sobre servicios.',                         true),
  ('QUOTE',              'Cotización',           'Solicitud de cotización.',                          true),
  ('PRICING',            'Precios',              'Consulta sobre precios.',                           true),
  ('MEETING',            'Reunión',              'Solicitud de reunión.',                             true),
  ('FOLLOW_UP',          'Seguimiento',          'Solicitud de seguimiento.',                         true),
  ('TECHNICAL_QUESTION', 'Pregunta técnica',     'Consulta técnica.',                                 true),
  ('PQR',                'PQR',                  'Solicitud relacionada con PQR.',                    true),
  ('COMPLAINT',          'Queja',                'Manifestación de inconformidad.',                   true),
  ('CAREERS',            'Empleo',               'Consulta relacionada con oportunidades laborales.', true),
  ('CONTACT',            'Contacto',             'Solicitud de información de contacto.',             true),
  ('HUMAN_AGENT',        'Asesor humano',        'Solicitud de atención humana.',                     true),
  ('UNKNOWN',            'Desconocida',          'Intención no determinada.',                         true)
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. Proveedor de almacenamiento. Solo si la tabla está vacía: no tiene índice
--    único, y una instalación con cualquier proveedor ya decidió su configuración.
--    Sin ruta ni bucket: el código no los usa y son propios de cada entorno.
-- ----------------------------------------------------------------------------
LOCK TABLE foundation.storage_providers IN SHARE ROW EXCLUSIVE MODE;

INSERT INTO foundation.storage_providers (name, provider_type, is_default, is_active)
SELECT 'Local Storage', 'LOCAL', true, true
 WHERE NOT EXISTS (SELECT 1 FROM foundation.storage_providers);

-- ----------------------------------------------------------------------------
-- 6. Comprobación final dentro de la misma transacción: los códigos que usa el código.
-- ----------------------------------------------------------------------------
DO $final_check$
DECLARE
  v_types      integer;
  v_statuses   integer;
  v_priorities integer;
  v_intents    integer;
  v_providers  integer;
BEGIN
  SELECT count(*) INTO v_types FROM pqr.request_types
   WHERE code IN ('PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA', 'FELICITACION');
  SELECT count(*) INTO v_statuses FROM pqr.request_statuses WHERE code IN ('RECEIVED', 'IN_PROGRESS', 'CLOSED');
  SELECT count(*) INTO v_priorities FROM pqr.request_priorities WHERE code = 'MEDIUM';
  SELECT count(*) INTO v_intents FROM chat.chat_intents
   WHERE code IN ('GREETING', 'SERVICE_INQUIRY', 'QUOTE', 'PQR', 'CAREERS', 'CONTACT', 'HUMAN_AGENT', 'UNKNOWN');

  IF v_types <> 5 OR v_statuses <> 3 OR v_priorities <> 1 OR v_intents <> 8 THEN
    RAISE EXCEPTION '016_platform_catalog_bootstrap: resultado incompleto (tipos %/5, estados %/3, prioridad %/1, intenciones %/8).',
      v_types, v_statuses, v_priorities, v_intents;
  END IF;

  SELECT count(*) INTO v_providers FROM foundation.storage_providers WHERE is_active IS TRUE;
  IF v_providers = 0 THEN
    RAISE NOTICE '016_platform_catalog_bootstrap: todos los proveedores de almacenamiento están desactivados; no se modifican.';
  END IF;

  RAISE NOTICE '016_platform_catalog_bootstrap: catálogos listos.';
END
$final_check$;

COMMIT;
