/**
 * Catálogo fijo de permisos del sistema (Fase 5).
 *
 * Etapa 2 (2026-08-26): estas claves usan el formato real de 3 partes
 * (`modulo.recurso.accion`) que ya existía en `security.permissions` de
 * `jud_platform_dev` (44 filas), en vez del formato de 2 partes que traía
 * el código originalmente (`recurso.accion`). El código se adaptó a la base
 * real, no al revés — ver docs/backend-audit.md y
 * database/docs/MIGRATION_LOG.md (Etapa 2) para el detalle completo del
 * mapeo y las 32 claves que se agregaron a la base para cubrir los módulos
 * que el backend ya implementa (roles, CRM completo, cms.team, cms.news,
 * audit).
 */
export const PERMISSION_KEYS = [
  'security.users.read',
  'security.users.create',
  'security.users.update',
  'security.users.delete',

  'security.roles.read',
  'security.roles.create',
  'security.roles.update',
  'security.roles.delete',

  'cms.services.read',
  'cms.services.create',
  'cms.services.update',
  'cms.services.delete',

  'cms.news.read',
  'cms.news.create',
  'cms.news.update',
  'cms.news.delete',

  'cms.blog.read',
  'cms.blog.create',
  'cms.blog.update',
  'cms.blog.delete',

  'cms.team.read',
  'cms.team.create',
  'cms.team.update',
  'cms.team.delete',

  'cms.home.read',
  'cms.home.update',

  'cms.hero.read',
  'cms.hero.create',
  'cms.hero.update',
  'cms.hero.delete',

  'cms.values.read',
  'cms.values.create',
  'cms.values.update',
  'cms.values.delete',

  'cms.concepts.read',
  'cms.concepts.create',
  'cms.concepts.update',
  'cms.concepts.delete',

  'pqrs.tickets.read',
  'pqrs.tickets.update',

  'jobs.vacancies.read',
  'jobs.vacancies.create',
  'jobs.vacancies.update',
  'jobs.vacancies.delete',

  'crm.leads.read',
  'crm.leads.create',
  'crm.leads.update',
  'crm.leads.delete',
  'crm.leads.assign',
  'crm.leads.convert',

  'crm.companies.read',
  'crm.companies.create',
  'crm.companies.update',
  'crm.companies.delete',

  'crm.contacts.read',
  'crm.contacts.create',
  'crm.contacts.update',
  'crm.contacts.delete',

  'crm.opportunities.read',
  'crm.opportunities.create',
  'crm.opportunities.update',
  'crm.opportunities.delete',
  'crm.opportunities.assign',
  'crm.opportunities.change_stage',
  'crm.opportunities.close',

  'crm.pipeline.read',

  'crm.tasks.read',
  'crm.tasks.create',
  'crm.tasks.update',
  'crm.tasks.delete',
  'crm.tasks.assign',

  'crm.activities.read',
  'crm.activities.create',
  'crm.activities.update',
  'crm.activities.delete',

  'audit.logs.read',

  'foundation.files.read',
  'foundation.files.create',
  'foundation.files.delete',

  'foundation.settings.read',
  'foundation.settings.update',

  // Analítica web (Etapa 15) — claves que ya existían en security.permissions sin uso.
  'analytics.dashboard.read',
  'analytics.reports.export',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

/** Módulo real (columna `module` de `security.permissions`) de cada clave. */
export const PERMISSION_MODULES: Record<PermissionKey, string> = {
  'security.users.read': 'security',
  'security.users.create': 'security',
  'security.users.update': 'security',
  'security.users.delete': 'security',
  'security.roles.read': 'security',
  'security.roles.create': 'security',
  'security.roles.update': 'security',
  'security.roles.delete': 'security',

  'cms.services.read': 'cms',
  'cms.services.create': 'cms',
  'cms.services.update': 'cms',
  'cms.services.delete': 'cms',
  'cms.news.read': 'cms',
  'cms.news.create': 'cms',
  'cms.news.update': 'cms',
  'cms.news.delete': 'cms',
  'cms.blog.read': 'cms',
  'cms.blog.create': 'cms',
  'cms.blog.update': 'cms',
  'cms.blog.delete': 'cms',
  'cms.team.read': 'cms',
  'cms.team.create': 'cms',
  'cms.team.update': 'cms',
  'cms.team.delete': 'cms',

  'cms.home.read': 'cms',
  'cms.home.update': 'cms',

  'cms.hero.read': 'cms',
  'cms.hero.create': 'cms',
  'cms.hero.update': 'cms',
  'cms.hero.delete': 'cms',

  'cms.values.read': 'cms',
  'cms.values.create': 'cms',
  'cms.values.update': 'cms',
  'cms.values.delete': 'cms',

  'cms.concepts.read': 'cms',
  'cms.concepts.create': 'cms',
  'cms.concepts.update': 'cms',
  'cms.concepts.delete': 'cms',

  'pqrs.tickets.read': 'pqrs',
  'pqrs.tickets.update': 'pqrs',

  'jobs.vacancies.read': 'jobs',
  'jobs.vacancies.create': 'jobs',
  'jobs.vacancies.update': 'jobs',
  'jobs.vacancies.delete': 'jobs',

  'crm.leads.read': 'crm',
  'crm.leads.create': 'crm',
  'crm.leads.update': 'crm',
  'crm.leads.delete': 'crm',
  'crm.leads.assign': 'crm',
  'crm.leads.convert': 'crm',

  'crm.companies.read': 'crm',
  'crm.companies.create': 'crm',
  'crm.companies.update': 'crm',
  'crm.companies.delete': 'crm',

  'crm.contacts.read': 'crm',
  'crm.contacts.create': 'crm',
  'crm.contacts.update': 'crm',
  'crm.contacts.delete': 'crm',

  'crm.opportunities.read': 'crm',
  'crm.opportunities.create': 'crm',
  'crm.opportunities.update': 'crm',
  'crm.opportunities.delete': 'crm',
  'crm.opportunities.assign': 'crm',
  'crm.opportunities.change_stage': 'crm',
  'crm.opportunities.close': 'crm',

  'crm.pipeline.read': 'crm',

  'crm.tasks.read': 'crm',
  'crm.tasks.create': 'crm',
  'crm.tasks.update': 'crm',
  'crm.tasks.delete': 'crm',
  'crm.tasks.assign': 'crm',

  'crm.activities.read': 'crm',
  'crm.activities.create': 'crm',
  'crm.activities.update': 'crm',
  'crm.activities.delete': 'crm',

  'audit.logs.read': 'audit',

  'foundation.files.read': 'foundation',
  'foundation.files.create': 'foundation',
  'foundation.files.delete': 'foundation',

  'foundation.settings.read': 'foundation',
  'foundation.settings.update': 'foundation',

  'analytics.dashboard.read': 'analytics',
  'analytics.reports.export': 'analytics',
};
