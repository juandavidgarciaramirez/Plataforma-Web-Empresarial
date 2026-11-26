-- Verificación de solo lectura de 016_platform_catalog_bootstrap.sql.
--
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -f 016_platform_catalog_bootstrap_verify.sql
--
-- Termina con error si falta un código que usa la aplicación. Corre en una
-- transacción READ ONLY: no puede modificar datos.

BEGIN TRANSACTION READ ONLY;

-- Este archivo está en UTF-8.
SET LOCAL client_encoding = 'UTF8';

SELECT code, name, is_active, sort_order FROM pqr.request_types ORDER BY sort_order, id;
SELECT code, name, is_closed, is_active, sort_order FROM pqr.request_statuses ORDER BY sort_order, id;
SELECT code, name, level, is_active FROM pqr.request_priorities ORDER BY level, id;
SELECT code, name, is_active FROM chat.chat_intents ORDER BY code;
SELECT name, provider_type, is_default, is_active FROM foundation.storage_providers ORDER BY id;

DO $verify$
DECLARE
  v_missing text;
BEGIN
  SELECT string_agg(v.code, ', ') INTO v_missing
    FROM (VALUES ('PETICION'), ('QUEJA'), ('RECLAMO'), ('SUGERENCIA'), ('FELICITACION')) AS v(code)
   WHERE NOT EXISTS (SELECT 1 FROM pqr.request_types t WHERE t.code = v.code);
  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'FALLO: faltan tipos en pqr.request_types: %. Ejecutar 016_platform_catalog_bootstrap.sql.', v_missing;
  END IF;

  SELECT string_agg(v.code, ', ') INTO v_missing
    FROM (VALUES ('RECEIVED'), ('IN_PROGRESS'), ('CLOSED')) AS v(code)
   WHERE NOT EXISTS (SELECT 1 FROM pqr.request_statuses s WHERE s.code = v.code);
  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'FALLO: faltan estados en pqr.request_statuses: %. Ejecutar 016_platform_catalog_bootstrap.sql.', v_missing;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pqr.request_priorities WHERE code = 'MEDIUM') THEN
    RAISE EXCEPTION 'FALLO: falta la prioridad MEDIUM en pqr.request_priorities. Ejecutar 016_platform_catalog_bootstrap.sql.';
  END IF;

  SELECT string_agg(v.code, ', ') INTO v_missing
    FROM (VALUES ('GREETING'), ('SERVICE_INQUIRY'), ('QUOTE'), ('PQR'), ('CAREERS'), ('CONTACT'), ('HUMAN_AGENT'), ('UNKNOWN')) AS v(code)
   WHERE NOT EXISTS (SELECT 1 FROM chat.chat_intents i WHERE i.code = v.code);
  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'FALLO: faltan intenciones en chat.chat_intents: %. Ejecutar 016_platform_catalog_bootstrap.sql.', v_missing;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM foundation.storage_providers) THEN
    RAISE EXCEPTION 'FALLO: foundation.storage_providers está vacía. Ejecutar 016_platform_catalog_bootstrap.sql.';
  END IF;

  RAISE NOTICE 'OK: catálogos de plataforma verificados.';
END
$verify$;

ROLLBACK;
