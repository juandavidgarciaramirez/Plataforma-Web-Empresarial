-- ============================================================================
-- 015 — Bootstrap de catálogos del CRM
-- Archivo  : database/migrations/015_crm_catalog_bootstrap.sql
-- Verifica : database/migrations/015_crm_catalog_bootstrap_verify.sql
-- Guía     : database/docs/CRM_PRODUCTION_BOOTSTRAP.md
--
-- Por qué existe: el código necesita estos registros para crear cualquier lead,
-- pero ninguna migración los definía. La 003 solo agregaba 4 fuentes y daba por
-- hecho el resto, que venía de datos cargados a mano en la base de desarrollo.
-- En una base nueva (solo esquema) los catálogos quedaban vacíos y Yuri no podía
-- registrar leads. Además, su `ON CONFLICT DO NOTHING` sobre `core.companies` no
-- evita duplicados porque `legal_name` no tiene índice único.
--
-- Qué garantiza: 14 fuentes, 10 estados, el pipeline predeterminado "Ventas",
-- sus 5 etapas requeridas, el país por defecto y la empresa técnica placeholder.
--
-- Seguridad:
--   * Compatible con PostgreSQL 10.
--   * Una sola transacción: si algo falla no queda nada aplicado.
--   * Idempotente: se puede ejecutar varias veces sin duplicar ni fallar.
--   * Solo INSERT. Sin DDL, UPDATE ni DELETE: las filas existentes no se tocan.
--   * Si encuentra un estado contradictorio se detiene con un error descriptivo
--     en lugar de corregirlo por su cuenta.
--   * Sin datos de demostración.
--
-- Mantener sincronizado con backend/src/modules/crm/common/crm-catalog.json
-- (lo comprueba backend/test/crm-catalog-consistency.test.js).
--
-- Ensayo sin dejar cambios:
--   sed -E 's/^COMMIT;\r?$/ROLLBACK;/' 015_crm_catalog_bootstrap.sql | psql "$DB_URL" -v ON_ERROR_STOP=1
-- Aplicar:
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -f 015_crm_catalog_bootstrap.sql
-- ============================================================================

BEGIN;

-- Este archivo está en UTF-8. Sin esto, un cliente con otra codificación (consola
-- de Windows, servidor con LANG en LATIN1) insertaría 'Correo ElectrÃ³nico' como una
-- fila nueva, sin ningún error. Se revierte solo al terminar la transacción.
SET LOCAL client_encoding = 'UTF8';

-- No esperar indefinidamente si otra sesión retiene alguna de estas tablas.
SET LOCAL lock_timeout = '15s';

-- Serializa ejecuciones simultáneas. Este modo no bloquea las lecturas ni las
-- comprobaciones de claves foráneas de los leads que se estén creando.
LOCK TABLE crm.lead_sources, crm.lead_statuses, crm.pipelines, crm.pipeline_stages,
           core.countries, core.companies
  IN SHARE ROW EXCLUSIVE MODE;

-- ----------------------------------------------------------------------------
-- 1. Fuentes comerciales (índice único: idx_lead_source_name).
-- ----------------------------------------------------------------------------
INSERT INTO crm.lead_sources (name, description, icon, color, is_active, sort_order) VALUES
  ('Sitio Web',          'Leads provenientes del sitio web',                 'Globe',          '#2563EB', true,  1),
  ('WhatsApp',           'Leads provenientes de WhatsApp',                   'MessageCircle',  '#25D366', true,  2),
  ('Correo Electrónico', 'Leads provenientes de correo electrónico',         'Mail',           '#EA4335', true,  3),
  ('Teléfono',           'Leads provenientes de llamadas telefónicas',       'Phone',          '#16A34A', true,  4),
  ('Facebook',           'Leads provenientes de Facebook',                   'Facebook',       '#1877F2', true,  5),
  ('Instagram',          'Leads provenientes de Instagram',                  'Instagram',      '#E1306C', true,  6),
  ('LinkedIn',           'Leads provenientes de LinkedIn',                   'Linkedin',       '#0A66C2', true,  7),
  ('Referido',           'Leads referidos por terceros',                     'Users',          '#7C3AED', true,  8),
  ('Contacto Directo',   'Contacto realizado directamente por el prospecto', 'UserPlus',       '#0891B2', true,  9),
  ('Otro',               'Otras fuentes de captación',                       'MoreHorizontal', '#64748B', true, 10),
  ('Yuri (Chatbot)',     'Lead generado por el asistente virtual Yuri.',     NULL,             NULL,      true, 11),
  ('Registro Manual',    'Lead creado manualmente por un usuario del CRM.',  NULL,             NULL,      true, 12),
  ('Chat en Vivo',       'Lead generado desde un chat en vivo con agente humano.', NULL,       NULL,      true, 13),
  ('PQR',                'Lead generado a partir de una PQR.',               NULL,             NULL,      true, 14)
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Estados del lead (índice único: idx_lead_statuses_name).
--    Estado y etapa son catálogos distintos: "En Gestión" es un estado y su
--    etapa correspondiente es "Calificado" (ver appStatuses en crm-catalog.json).
-- ----------------------------------------------------------------------------
INSERT INTO crm.lead_statuses (name, color, is_final, is_success, sort_order, is_active) VALUES
  ('Nuevo',             '#3B82F6', false, false,  1, true),
  ('Contactado',        '#06B6D4', false, false,  2, true),
  ('En Gestión',        '#8B5CF6', false, false,  3, true),
  ('Esperando Cliente', '#F59E0B', false, false,  4, true),
  ('Propuesta Enviada', '#F97316', false, false,  5, true),
  ('Negociación',       '#A855F7', false, false,  6, true),
  ('Ganado',            '#10B981', true,  true,   7, true),
  ('Perdido',           '#EF4444', true,  false,  8, true),
  ('No Interesado',     '#6B7280', true,  false,  9, true),
  ('Suspendido',        '#374151', true,  false, 10, true)
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Pipeline predeterminado y sus etapas.
--    `crm.pipeline_stages` no tiene índice único por nombre: la idempotencia de
--    las etapas la dan el LOCK anterior y la comprobación de existencia.
-- ----------------------------------------------------------------------------
DO $pipeline$
DECLARE
  v_pipeline_name CONSTANT text := 'Ventas';
  v_default_count integer;
  v_default_name  text;
  v_inactive      text;
  v_pipeline_id   bigint;
  v_stage_count   integer;
  v_order_owner   text;
  v_problems      text[] := ARRAY[]::text[];
  r               record;
BEGIN
  -- Un predeterminado desactivado es contradictorio: el negocio no puede usarlo
  -- y no corresponde decidir aquí si se reactiva o se descarta.
  SELECT string_agg(name, ', ' ORDER BY name) INTO v_inactive
    FROM crm.pipelines WHERE is_default IS TRUE AND is_active IS NOT TRUE;
  IF v_inactive IS NOT NULL THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: pipeline predeterminado desactivado: %.', v_inactive
      USING HINT = 'Decidir manualmente: reactivarlo o quitarle is_default. La migración no cambia pipelines existentes.';
  END IF;

  SELECT count(*), string_agg(name, ', ' ORDER BY name) INTO v_default_count, v_default_name
    FROM crm.pipelines WHERE is_default IS TRUE;

  IF v_default_count > 1 THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: hay % pipelines predeterminados activos: %. Debe existir exactamente uno.',
      v_default_count, v_default_name
      USING HINT = 'Dejar is_default solo en el pipeline correcto y volver a ejecutar.';
  END IF;

  IF v_default_count = 1 AND v_default_name <> v_pipeline_name THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: el pipeline predeterminado es "%", se esperaba "%".',
      v_default_name, v_pipeline_name
      USING HINT = 'No se reemplaza un predeterminado existente. Si es correcto, ajustar el nombre del pipeline en crm-catalog.json y en esta migración.';
  END IF;

  SELECT id INTO v_pipeline_id FROM crm.pipelines WHERE name = v_pipeline_name;

  IF v_default_count = 0 AND v_pipeline_id IS NOT NULL THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: el pipeline "%" existe pero no es el predeterminado activo.', v_pipeline_name
      USING HINT = 'Revisar por qué se cambió y, si corresponde, activarlo con is_default = true e is_active = true.';
  END IF;

  IF v_pipeline_id IS NULL THEN
    INSERT INTO crm.pipelines (name, description, color, is_default, is_active)
    VALUES (v_pipeline_name, 'Pipeline principal de oportunidades comerciales', '#2563EB', true, true)
    RETURNING id INTO v_pipeline_id;
  END IF;

  FOR r IN
    SELECT * FROM (VALUES
      ('Nuevo',      'Lead recién ingresado al pipeline',  1,  10.00, '#64748B', false, false),
      ('Contactado', 'Se realizó el primer contacto',      2,  20.00, '#3B82F6', false, false),
      ('Calificado', 'Lead calificado comercialmente',     3,  40.00, '#8B5CF6', false, false),
      ('Perdido',    'Oportunidad cerrada sin conversión', 4,   0.00, '#EF4444', true,  false),
      ('Ganado',     'Oportunidad convertida en cliente',  5, 100.00, '#22C55E', true,  true)
    ) AS v(name, description, stage_order, probability, color, is_closed, is_success)
  LOOP
    SELECT count(*) INTO v_stage_count
      FROM crm.pipeline_stages WHERE pipeline_id = v_pipeline_id AND name = r.name;

    IF v_stage_count > 1 THEN
      v_problems := v_problems || format('etapa "%s" duplicada (%s filas)', r.name, v_stage_count);

    ELSIF v_stage_count = 1 THEN
      IF EXISTS (
        SELECT 1 FROM crm.pipeline_stages
         WHERE pipeline_id = v_pipeline_id AND name = r.name
           AND (is_closed IS DISTINCT FROM r.is_closed OR is_success IS DISTINCT FROM r.is_success)
      ) THEN
        v_problems := v_problems || format('etapa "%s" con is_closed/is_success distintos de %s/%s',
                                           r.name, r.is_closed, r.is_success);
      END IF;

      -- Otro orden es válido: una instalación puede tener etapas adicionales
      -- (p. ej. Propuesta, Negociación) y el código no depende de stage_order.
      IF EXISTS (
        SELECT 1 FROM crm.pipeline_stages
         WHERE pipeline_id = v_pipeline_id AND name = r.name AND stage_order <> r.stage_order
      ) THEN
        RAISE NOTICE '015_crm_catalog_bootstrap: la etapa "%" usa otro stage_order (referencia: %); no se modifica.',
          r.name, r.stage_order;
      END IF;

    ELSE
      SELECT string_agg(name, ', ') INTO v_order_owner
        FROM crm.pipeline_stages WHERE pipeline_id = v_pipeline_id AND stage_order = r.stage_order;

      IF v_order_owner IS NOT NULL THEN
        v_problems := v_problems || format('falta la etapa "%s" y su stage_order %s ya lo usa "%s"',
                                           r.name, r.stage_order, v_order_owner);
      ELSE
        INSERT INTO crm.pipeline_stages (pipeline_id, name, description, stage_order, probability, color, is_closed, is_success)
        VALUES (v_pipeline_id, r.name, r.description, r.stage_order, r.probability, r.color, r.is_closed, r.is_success);
      END IF;
    END IF;
  END LOOP;

  IF array_length(v_problems, 1) > 0 THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: etapas del pipeline "%" contradictorias: %.',
      v_pipeline_name, array_to_string(v_problems, '; ')
      USING HINT = 'Corregir las etapas manualmente. Los leads existentes pueden depender de ellas: no se cambian de forma automática.';
  END IF;
END
$pipeline$;

-- ----------------------------------------------------------------------------
-- 4. País por defecto (índices únicos: iso2, iso3).
-- ----------------------------------------------------------------------------
INSERT INTO core.countries (iso2, iso3, name, phone_code, currency_code, currency_name)
VALUES ('CO', 'COL', 'Colombia', '+57', 'COP', 'Peso colombiano')
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. Empresa técnica para contactos sin empresa (`core.contacts.company_id` es
--    NOT NULL). No es un cliente. `legal_name` no tiene índice único, por eso se
--    comprueba su existencia en vez de usar ON CONFLICT.
-- ----------------------------------------------------------------------------
DO $placeholder$
DECLARE
  v_legal_name CONSTANT text := 'Contactos Independientes (Sin Empresa)';
  v_country_id bigint;
  v_count      integer;
BEGIN
  SELECT id INTO v_country_id FROM core.countries WHERE iso2 = 'CO';
  IF v_country_id IS NULL THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: no se pudo garantizar el país con iso2 = CO.'
      USING HINT = 'Probablemente otra fila ya usa iso3 = COL. Revisar core.countries.';
  END IF;

  SELECT count(*) INTO v_count FROM core.companies WHERE lower(legal_name) = lower(v_legal_name);

  IF v_count > 1 THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: la empresa placeholder "%" está duplicada (% filas).', v_legal_name, v_count
      USING HINT = 'Puede tener contactos asociados: unificarla manualmente antes de volver a ejecutar.';
  END IF;

  IF v_count = 0 THEN
    INSERT INTO core.companies (country_id, legal_name, commercial_name, description, is_active)
    VALUES (v_country_id, v_legal_name, 'Sin Empresa',
            'Empresa placeholder del CRM para contactos que no pertenecen a ninguna empresa real. No es un cliente.',
            true);
  END IF;
END
$placeholder$;

-- ----------------------------------------------------------------------------
-- 6. Comprobación final dentro de la misma transacción.
-- ----------------------------------------------------------------------------
DO $final_check$
DECLARE
  v_sources integer;
  v_statuses integer;
  v_defaults integer;
  v_stages integer;
BEGIN
  SELECT count(*) INTO v_sources FROM crm.lead_sources WHERE name IN (
    'Sitio Web', 'WhatsApp', 'Correo Electrónico', 'Teléfono', 'Facebook', 'Instagram', 'LinkedIn',
    'Referido', 'Contacto Directo', 'Otro', 'Yuri (Chatbot)', 'Registro Manual', 'Chat en Vivo', 'PQR');

  SELECT count(*) INTO v_statuses FROM crm.lead_statuses WHERE name IN (
    'Nuevo', 'Contactado', 'En Gestión', 'Esperando Cliente', 'Propuesta Enviada', 'Negociación',
    'Ganado', 'Perdido', 'No Interesado', 'Suspendido');

  SELECT count(*) INTO v_defaults FROM crm.pipelines
   WHERE name = 'Ventas' AND is_default IS TRUE AND is_active IS TRUE;

  SELECT count(*) INTO v_stages FROM crm.pipeline_stages s
    JOIN crm.pipelines p ON p.id = s.pipeline_id
   WHERE p.name = 'Ventas' AND s.name IN ('Nuevo', 'Contactado', 'Calificado', 'Perdido', 'Ganado');

  IF v_sources <> 14 OR v_statuses <> 10 OR v_defaults <> 1 OR v_stages <> 5 THEN
    RAISE EXCEPTION '015_crm_catalog_bootstrap: resultado incompleto (fuentes %/14, estados %/10, pipeline %/1, etapas %/5).',
      v_sources, v_statuses, v_defaults, v_stages;
  END IF;

  RAISE NOTICE '015_crm_catalog_bootstrap: catálogo listo (fuentes 14, estados 10, pipeline Ventas, etapas 5, placeholder 1).';
END
$final_check$;

COMMIT;
