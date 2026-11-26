import { PermissionKey } from '../permissions/permissions.constants';

/**
 * SUPERADO (Etapa 2, 2026-08-26): esto era el seed de `InMemoryRoleRepository`.
 * Los roles reales de `security.roles` en `jud_platform_dev` son en español
 * y no coinciden con esta lista (Administrador, Editor, Comercial, Cliente,
 * Visitante, Recursos Humanos, Soporte — ver database/docs/MIGRATION_LOG.md
 * Etapa 2). Con `PrismaRoleRepository` conectado, este archivo ya no se usa
 * en el flujo real; se conserva solo por si `InMemoryRoleRepository` se
 * vuelve a necesitar (tests sin base de datos, por ejemplo).
 */

/** Roles iniciales del sistema (Fase 4). */
export const ROLE_NAMES = [
  'SUPER_ADMIN',
  'ADMIN',
  'EDITOR',
  'COMMERCIAL',
  'HR',
  'SUPPORT',
  'VIEWER',
] as const;

export type RoleName = (typeof ROLE_NAMES)[number];

const ALL: PermissionKey[] = [
  'security.users.read', 'security.users.create', 'security.users.update', 'security.users.delete',
  'security.roles.read', 'security.roles.create', 'security.roles.update', 'security.roles.delete',
  'cms.services.read', 'cms.services.create', 'cms.services.update', 'cms.services.delete',
  'cms.news.read', 'cms.news.create', 'cms.news.update', 'cms.news.delete',
  'cms.blog.read', 'cms.blog.create', 'cms.blog.update', 'cms.blog.delete',
  'cms.team.read', 'cms.team.create', 'cms.team.update', 'cms.team.delete',
  'pqrs.tickets.read', 'pqrs.tickets.update',
  'jobs.vacancies.read', 'jobs.vacancies.create', 'jobs.vacancies.update', 'jobs.vacancies.delete',
  'crm.leads.read', 'crm.leads.create', 'crm.leads.update', 'crm.leads.delete', 'crm.leads.assign', 'crm.leads.convert',
  'crm.companies.read', 'crm.companies.create', 'crm.companies.update', 'crm.companies.delete',
  'crm.contacts.read', 'crm.contacts.create', 'crm.contacts.update', 'crm.contacts.delete',
  'crm.opportunities.read', 'crm.opportunities.create', 'crm.opportunities.update', 'crm.opportunities.delete',
  'crm.opportunities.assign', 'crm.opportunities.change_stage', 'crm.opportunities.close',
  'crm.pipeline.read',
  'crm.tasks.read', 'crm.tasks.create', 'crm.tasks.update', 'crm.tasks.delete', 'crm.tasks.assign',
  'crm.activities.read', 'crm.activities.create', 'crm.activities.update', 'crm.activities.delete',
  'audit.logs.read',
];

const CRM_ALL: PermissionKey[] = ALL.filter((p) =>
  ['crm.leads.', 'crm.companies.', 'crm.contacts.', 'crm.opportunities.', 'crm.pipeline.', 'crm.tasks.', 'crm.activities.'].some((prefix) =>
    p.startsWith(prefix),
  ),
);

const READ_ONLY: PermissionKey[] = ALL.filter((p) => p.endsWith('.read'));

/**
 * Mapa de permisos por defecto para cada rol inicial. Se usa únicamente
 * para el seed de arranque (implementación temporal en memoria); una vez
 * exista PostgreSQL, esta asignación vive en la tabla de relación rol↔permiso.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  SUPER_ADMIN: ALL,
  ADMIN: ALL.filter((p) => p !== 'security.roles.delete'),
  EDITOR: ['cms.services.read', 'cms.services.create', 'cms.services.update', 'cms.news.read', 'cms.news.create', 'cms.news.update', 'cms.news.delete', 'cms.blog.read', 'cms.blog.create', 'cms.blog.update', 'cms.blog.delete', 'cms.team.read', 'cms.team.create', 'cms.team.update', 'cms.team.delete'],
  COMMERCIAL: [...CRM_ALL, 'cms.services.read'],
  HR: ['jobs.vacancies.read', 'jobs.vacancies.create', 'jobs.vacancies.update', 'security.users.read'],
  SUPPORT: ['pqrs.tickets.read', 'pqrs.tickets.update'],
  VIEWER: READ_ONLY,
};

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  SUPER_ADMIN: 'Acceso total al sistema, incluida la gestión de roles y permisos.',
  ADMIN: 'Administración general, sin poder eliminar roles del sistema.',
  EDITOR: 'Gestión de contenido: servicios, noticias y blog.',
  COMMERCIAL: 'Gestión comercial: CRM y visibilidad de servicios.',
  HR: 'Gestión de talento humano: convocatorias y postulaciones.',
  SUPPORT: 'Atención de PQRS.',
  VIEWER: 'Acceso de solo lectura a todos los módulos.',
};
