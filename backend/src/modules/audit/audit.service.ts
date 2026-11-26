import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { safeErrorSummary } from '../../common/utils/safe-error.util';

export interface AuditEntry {
  id: string;
  actorEmail: string;
  action: string; // p.ej. "users.create"
  description: string;
  createdAt: Date;
}

/** Agrupa una acción (p. ej. "team.create") en un módulo legible para `security.audit_logs.module`. */
const MODULE_PREFIXES: Record<string, string> = {
  team: 'cms',
  company_profile: 'cms',
  hero_slides: 'cms',
  company_values: 'cms',
  who_we_are_concepts: 'cms',
  blog_posts: 'cms',
  news: 'cms',
  services: 'cms',
  crm: 'crm',
  lead: 'crm',
  opportunit: 'crm',
  activit: 'crm',
  task: 'crm',
  company: 'crm',
  contact: 'crm',
  users: 'security',
  roles: 'security',
  permissions: 'security',
  auth: 'security',
  pqr: 'pqrs',
  application: 'jobs',
  vacanc: 'jobs',
};

function resolveModule(entity: string): string {
  const match = Object.keys(MODULE_PREFIXES).find((prefix) => entity.startsWith(prefix));
  return match ? MODULE_PREFIXES[match] : 'app';
}

/**
 * Bitácora de auditoría real sobre `security.audit_logs` (Etapa 11).
 * Antes vivía 100% en memoria (`AuditEntry[]` con tope de 200, se perdía en
 * cada reinicio del proceso — y el backend se ha reiniciado muchas veces en
 * esta sesión). `core.audit_logs` (esquema paralelo, misma auditoría a
 * nivel de negocio) queda intencionalmente sin usar: `security.audit_logs`
 * es más rico (sesión, IP, user-agent, request) y es el que ya referencia
 * el guard de autenticación — se documenta la decisión aquí en vez de
 * duplicar la escritura en ambas tablas.
 *
 * Los campos de contexto HTTP (ip/user-agent/browser/request) no están
 * disponibles en este nivel (el servicio se llama desde services, no desde
 * un interceptor con acceso al Request) — quedan en NULL. Ver
 * docs/backend-audit.md, pendiente: propagar el contexto de request via
 * `AsyncLocalStorage` o un interceptor si se necesita ese detalle.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Fire-and-forget: nunca debe tumbar el flujo principal si falla la escritura de auditoría. */
  log(actorEmail: string, action: string, description: string): void {
    this.persist(actorEmail, action, description).catch((err) => {
      this.logger.error(`No se pudo escribir en security.audit_logs (action=${action}): ${safeErrorSummary(err)}`);
    });
  }

  private async persist(actorEmail: string, action: string, description: string): Promise<void> {
    const entity = action.includes('.') ? action.slice(0, action.lastIndexOf('.')) : action;
    const module = resolveModule(entity);

    let userId: bigint | null = null;
    if (actorEmail) {
      const user = await this.prisma.users.findFirst({
        where: { email: { equals: actorEmail, mode: 'insensitive' } },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }

    await this.prisma.security_audit_logs.create({
      data: {
        user_id: userId,
        module,
        entity,
        action,
        description,
      },
    });
  }

  private toEntry(row: {
    id: bigint;
    action: string;
    description: string | null;
    created_at: Date;
    users: { email: string } | null;
  }): AuditEntry {
    return {
      id: row.id.toString(),
      actorEmail: row.users?.email ?? '',
      action: row.action,
      description: row.description ?? '',
      createdAt: row.created_at,
    };
  }

  async recent(limit = 20): Promise<AuditEntry[]> {
    const rows = await this.prisma.security_audit_logs.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
      include: { users: { select: { email: true } } },
    });
    return rows.map((r) => this.toEntry(r));
  }

  /** Lista completa para `/admin/audit`, filtrable por prefijo de acción (p. ej. "opportunities."). */
  async findAll(filters?: { limit?: number; action?: string }): Promise<AuditEntry[]> {
    const rows = await this.prisma.security_audit_logs.findMany({
      where: filters?.action ? { action: { startsWith: filters.action } } : undefined,
      orderBy: { created_at: 'desc' },
      take: filters?.limit ?? 100,
      include: { users: { select: { email: true } } },
    });
    return rows.map((r) => this.toEntry(r));
  }
}
