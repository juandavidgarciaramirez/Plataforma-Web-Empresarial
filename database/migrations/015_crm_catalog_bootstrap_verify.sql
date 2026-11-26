-- Verificación de solo lectura de 015_crm_catalog_bootstrap.sql.
--
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -f 015_crm_catalog_bootstrap_verify.sql
--
-- Termina con error si falta algo. Corre en una transacción READ ONLY: no puede
-- modificar datos. No exige que crm.leads esté vacío.
--
-- El administrador configurado en SEED_ADMIN_EMAIL lo comprueba
-- `node scripts/verify-deploy.js crm`, que conoce esa variable; aquí solo se
-- exige que exista algún usuario activo con el rol Administrador.

BEGIN TRANSACTION READ ONLY;

-- Este archivo está en UTF-8: sin esto, otra codificación del cliente reportaría
-- como faltantes los nombres con acentos.
SET LOCAL client_encoding = 'UTF8';

SELECT v.name AS fuente_faltante
  FROM (VALUES ('Sitio Web'), ('WhatsApp'), ('Correo Electrónico'), ('Teléfono'), ('Facebook'), ('Instagram'),
               ('LinkedIn'), ('Referido'), ('Contacto Directo'), ('Otro'), ('Yuri (Chatbot)'),
               ('Registro Manual'), ('Chat en Vivo'), ('PQR')) AS v(name)
  LEFT JOIN crm.lead_sources s ON s.name = v.name
 WHERE s.id IS NULL;

SELECT v.name AS estado_faltante
  FROM (VALUES ('Nuevo'), ('Contactado'), ('En Gestión'), ('Esperando Cliente'), ('Propuesta Enviada'),
               ('Negociación'), ('Ganado'), ('Perdido'), ('No Interesado'), ('Suspendido')) AS v(name)
  LEFT JOIN crm.lead_statuses s ON s.name = v.name
 WHERE s.id IS NULL;

SELECT id, name, is_default, is_active FROM crm.pipelines ORDER BY id;

SELECT p.name AS pipeline, s.stage_order, s.name AS etapa, s.is_closed, s.is_success
  FROM crm.pipeline_stages s JOIN crm.pipelines p ON p.id = s.pipeline_id
 ORDER BY p.id, s.stage_order, s.id;

SELECT c.legal_name, c.commercial_name, co.iso2 AS pais, c.is_active
  FROM core.companies c JOIN core.countries co ON co.id = c.country_id
 WHERE lower(c.legal_name) = lower('Contactos Independientes (Sin Empresa)');

-- Informativo: estos valores no se exigen y la migración no los modifica.
SELECT (SELECT count(*) FROM crm.leads)      AS leads,
       (SELECT count(*) FROM core.contacts)  AS contactos,
       (SELECT count(*) FROM core.companies) AS empresas;

DO $verify$
DECLARE
  v_missing_sources  integer;
  v_missing_statuses integer;
  v_active_defaults  integer;
  v_default_name     text;
  v_missing_stages   text;
  v_placeholder      integer;
  v_admins           integer;
BEGIN
  SELECT count(*) INTO v_missing_sources
    FROM (VALUES ('Sitio Web'), ('WhatsApp'), ('Correo Electrónico'), ('Teléfono'), ('Facebook'), ('Instagram'),
                 ('LinkedIn'), ('Referido'), ('Contacto Directo'), ('Otro'), ('Yuri (Chatbot)'),
                 ('Registro Manual'), ('Chat en Vivo'), ('PQR')) AS v(name)
   WHERE NOT EXISTS (SELECT 1 FROM crm.lead_sources s WHERE s.name = v.name);
  IF v_missing_sources > 0 THEN
    RAISE EXCEPTION 'FALLO: faltan % fuentes en crm.lead_sources. Ejecutar 015_crm_catalog_bootstrap.sql.', v_missing_sources;
  END IF;

  SELECT count(*) INTO v_missing_statuses
    FROM (VALUES ('Nuevo'), ('Contactado'), ('En Gestión'), ('Esperando Cliente'), ('Propuesta Enviada'),
                 ('Negociación'), ('Ganado'), ('Perdido'), ('No Interesado'), ('Suspendido')) AS v(name)
   WHERE NOT EXISTS (SELECT 1 FROM crm.lead_statuses s WHERE s.name = v.name);
  IF v_missing_statuses > 0 THEN
    RAISE EXCEPTION 'FALLO: faltan % estados en crm.lead_statuses. Ejecutar 015_crm_catalog_bootstrap.sql.', v_missing_statuses;
  END IF;

  SELECT count(*), min(name) INTO v_active_defaults, v_default_name
    FROM crm.pipelines WHERE is_default IS TRUE AND is_active IS TRUE;
  IF v_active_defaults <> 1 OR v_default_name <> 'Ventas' THEN
    RAISE EXCEPTION 'FALLO: debe existir exactamente un pipeline predeterminado activo, "Ventas" (hay %, primero: %).',
      v_active_defaults, coalesce(v_default_name, 'ninguno');
  END IF;

  SELECT string_agg(v.name, ', ') INTO v_missing_stages
    FROM (VALUES ('Nuevo', false, false), ('Contactado', false, false), ('Calificado', false, false),
                 ('Perdido', true, false), ('Ganado', true, true)) AS v(name, is_closed, is_success)
   WHERE (SELECT count(*) FROM crm.pipeline_stages s JOIN crm.pipelines p ON p.id = s.pipeline_id
           WHERE p.name = 'Ventas' AND s.name = v.name
             AND s.is_closed IS NOT DISTINCT FROM v.is_closed
             AND s.is_success IS NOT DISTINCT FROM v.is_success) <> 1;
  IF v_missing_stages IS NOT NULL THEN
    RAISE EXCEPTION 'FALLO: etapas ausentes, duplicadas o con is_closed/is_success incorrectos en "Ventas": %.', v_missing_stages;
  END IF;

  SELECT count(*) INTO v_placeholder FROM core.companies
   WHERE lower(legal_name) = lower('Contactos Independientes (Sin Empresa)');
  IF v_placeholder <> 1 THEN
    RAISE EXCEPTION 'FALLO: debe existir exactamente una empresa placeholder (hay %).', v_placeholder;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM core.countries WHERE iso2 = 'CO') THEN
    RAISE EXCEPTION 'FALLO: no existe el país con iso2 = CO en core.countries.';
  END IF;

  SELECT count(*) INTO v_admins FROM security.users u JOIN security.roles r ON r.id = u.role_id
   WHERE r.name = 'Administrador' AND u.deleted_at IS NULL AND u.status = 'ACTIVE';
  IF v_admins = 0 THEN
    RAISE EXCEPTION 'FALLO: no hay ningún usuario activo con rol Administrador. Ejecutar npm run seed:security.';
  END IF;

  RAISE NOTICE 'OK: catálogo CRM verificado.';
END
$verify$;

ROLLBACK;
