-- ============================================================================
-- ETAPA 1 — FOUNDATION
-- Proyecto : Jud Platform
-- Archivo  : 001_foundation.sql
-- Objetivo : construir el schema `foundation` (infraestructura transversal
--            de plataforma) reubicando desde `core` las tablas que NO son
--            específicas del dominio "empresas/contactos" sino
--            infraestructura genérica reutilizable por todos los módulos:
--            almacenamiento de archivos y configuración del sistema.
--
-- Decisión documentada en database/audit/BASELINE.md (§9):
--   - countries/states/cities/currencies/languages/timezones/holidays NO
--     se tocan aquí -> candidatos a `catalog` (Etapa 4).
--   - companies/contacts/branches/company_*/contact_* NO se tocan -> se
--     quedan en `core`, protegidas explícitamente (encargo, sección 15).
--   - files, file_versions, file_categories, file_tags, file_shares,
--     file_access_logs, storage_providers, system_settings SÍ se mueven:
--     son infraestructura transversal (almacenamiento genérico + config
--     global), no "recursos corporativos" de una empresa puntual, y las
--     necesitarán content/crm/pqr/careers por igual.
--
-- Seguridad de la operación:
--   - Las 8 tablas tienen 0 filas (confirmado en BASELINE.md §6).
--   - ALTER TABLE ... SET SCHEMA es un cambio de catálogo, no reescribe
--     filas ni reescribe FKs (Postgres las resuelve por OID interno).
--   - Las 8 columnas `id` son GENERATED ALWAYS AS IDENTITY (confirmado por
--     consulta previa) -> su secuencia asociada viaja automáticamente con
--     la tabla al nuevo schema.
--   - Ningún código de NestJS referencia estas tablas todavía (backend
--     usa repositorios en memoria a la espera de este esquema).
--   - Reversible: ALTER TABLE foundation.<tabla> SET SCHEMA core; revierte
--     el cambio sin pérdida de datos si hiciera falta.
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS foundation;
COMMENT ON SCHEMA foundation IS 'Infraestructura transversal de plataforma: almacenamiento de archivos y configuración del sistema. Compartida por todos los módulos (core, crm, content, pqr, careers).';

ALTER TABLE core.system_settings   SET SCHEMA foundation;
ALTER TABLE core.storage_providers SET SCHEMA foundation;
ALTER TABLE core.files             SET SCHEMA foundation;
ALTER TABLE core.file_versions     SET SCHEMA foundation;
ALTER TABLE core.file_categories   SET SCHEMA foundation;
ALTER TABLE core.file_tags         SET SCHEMA foundation;
ALTER TABLE core.file_shares       SET SCHEMA foundation;
ALTER TABLE core.file_access_logs  SET SCHEMA foundation;

COMMIT;
