import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { LeadEntity, LeadSource, LeadStatus } from '../entities/lead.entity';
import { LeadRepository } from './lead.repository.interface';
import { safeErrorSummary } from '../../../../common/utils/safe-error.util';
import {
  CRM_CATALOG,
  findOrCreateCompanyByName,
  findOrCreateContactByEmail,
  generateLeadCode,
  missingCatalogError,
  resolveActorUserId,
} from '../../common/crm-db.util';

/**
 * Implementación real sobre `crm.leads` (Etapa 4, jud_platform_dev).
 *
 * Adaptaciones grandes respecto al esquema real (documentadas en
 * database/docs/MIGRATION_LOG.md, Etapa 4):
 * - `contact_id`, `assigned_to`, `source_id`, `status_id`, `pipeline_id`,
 *   `stage_id`, `created_by` son NOT NULL — el `LeadEntity` de la app no
 *   modela ninguna de estas relaciones directamente (solo `email`/`phone`/
 *   `companyName` como texto plano). Este repositorio resuelve/crea el
 *   Contacto y la Empresa reales (`core.contacts`/`core.companies`) al
 *   crear un lead, y resuelve un usuario real (asignado real, nunca
 *   inventado) para `assigned_to`/`created_by`. Las referencias de catálogo
 *   se resuelven antes de escribir y las escrituras van en una transacción: si
 *   algo falla no quedan empresas ni contactos huérfanos.
 * - `source`/`status` (enums de la app) se traducen a los catálogos reales
 *   `crm.lead_sources`/`crm.lead_statuses` (español, con filas agregadas en
 *   la Etapa 4 para YURI/MANUAL/CHAT/PQR). El `status` también determina la
 *   `stage_id` dentro del único pipeline real ("Ventas").
 * - `chatSessionId` no tiene columna propia -> se guarda en `campaign`
 *   (columna libre, sin otro uso real todavía) para poder buscar por él. La
 *   creación se serializa por sesión: dos peticiones simultáneas de la misma
 *   conversación no generan dos leads.
 * - `convertedToOpportunityId` no es una columna en `leads` -> se resuelve
 *   consultando `crm.opportunities.source_lead_id` (ver `attachConvertedIds`).
 */

const SOURCE_TO_REAL_NAME: Record<LeadSource, string> = CRM_CATALOG.appSources;
const REAL_NAME_TO_SOURCE: Record<string, LeadSource> = Object.fromEntries(
  Object.entries(SOURCE_TO_REAL_NAME).map(([k, v]) => [v, k as LeadSource]),
);

/** `status` app -> nombre real de `lead_statuses` + nombre real de `pipeline_stages` del pipeline predeterminado. */
const STATUS_TO_REAL: Record<LeadStatus, { status: string; stage: string }> = CRM_CATALOG.appStatuses;
const REAL_STATUS_NAME_TO_APP = CRM_CATALOG.statusToApp as Record<string, LeadStatus>;

const MAX_LEAD_CODE_ATTEMPTS = 5;
const LEAD_TRANSACTION_OPTIONS = { maxWait: 5_000, timeout: 10_000 };
/** Espacio de nombres del bloqueo por sesión de chat (`pg_advisory_xact_lock`). */
const CHAT_LEAD_LOCK_PREFIX = 'crm.leads.chat-session:';

/** El código aleatorio del lead ya existe: la transacción quedó abortada y hay que repetirla entera. */
function isLeadCodeClash(error: unknown): boolean {
  const { code, meta } = error as { code?: string; meta?: { target?: unknown } };
  return code === 'P2002' && String(meta?.target ?? '').includes('code');
}

type LeadRow = {
  id: bigint;
  code: string;
  title: string;
  interested_service: string | null;
  observations: string | null;
  campaign: string | null;
  is_converted: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  users_leads_assigned_toTousers: { id: bigint } | null;
  contacts_leads_contact_idTocontacts: { email: string | null; phone: string | null } | null;
  companies_leads_company_idTocompanies: { id: bigint; legal_name: string } | null;
  lead_sources: { name: string } | null;
  lead_statuses: { name: string } | null;
};

const LEAD_INCLUDE = {
  users_leads_assigned_toTousers: { select: { id: true } },
  contacts_leads_contact_idTocontacts: { select: { email: true, phone: true } },
  companies_leads_company_idTocompanies: { select: { id: true, legal_name: true } },
  lead_sources: { select: { name: true } },
  lead_statuses: { select: { name: true } },
} as const;

@Injectable()
export class PrismaLeadRepository implements LeadRepository {
  private readonly logger = new Logger(PrismaLeadRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<LeadEntity[]> {
    const rows = await this.prisma.leads.findMany({ include: LEAD_INCLUDE, orderBy: { created_at: 'desc' } });
    return this.attachConvertedIds(rows.map((row) => this.toEntity(row)));
  }

  async findById(id: string): Promise<LeadEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.leads.findUnique({ where: { id: bigintId }, include: LEAD_INCLUDE });
    if (!row) return null;
    const [entity] = await this.attachConvertedIds([this.toEntity(row)]);
    return entity;
  }

  async findByChatSessionId(chatSessionId: string): Promise<LeadEntity | null> {
    const row = await this.prisma.leads.findFirst({
      where: { campaign: chatSessionId, deleted_at: null },
      include: LEAD_INCLUDE,
      orderBy: { id: 'asc' },
    });
    if (!row) return null;
    const [entity] = await this.attachConvertedIds([this.toEntity(row)]);
    return entity;
  }

  async create(data: Omit<LeadEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadEntity> {
    // Antes de escribir nada: si falta un catálogo o el administrador, se falla
    // aquí con un error claro y sin dejar empresas ni contactos huérfanos.
    const placement = await this.resolvePipelinePlacement(data.source, data.status);
    // `assigned_to`/`created_by` son NOT NULL — si no hay un dueño real
    // explícito, se usa el administrador real configurado (decisión del
    // usuario, Etapa 4). Se usa el mismo id para ambas columnas: no hay
    // forma de distinguir "quién creó" de "a quién se asigna" en el
    // contrato actual de `LeadRepository.create()` (sin tocarlo).
    const ownerId = data.ownerUserId ? this.toBigInt(data.ownerUserId) : null;
    const assignedTo = ownerId ?? (await resolveActorUserId(this.prisma, null));

    const row = await this.createInTransaction(data, placement, assignedTo);

    const [entity] = await this.attachConvertedIds([this.toEntity(row)]);
    return entity;
  }

    async update(
      id: string,
      data: Partial<Omit<LeadEntity, 'id' | 'createdAt' | 'updatedAt'>>,
    ): Promise<LeadEntity | null> {
      const bigintId = this.toBigInt(id);
      if (bigintId === null) return null;

      const statusFields = data.status
        ? await this.resolveStatusPlacement(data.status)
        : {};

      try {
        const row = await this.prisma.$transaction(async (tx) => {
          // Recupera el contacto asociado al lead existente.
          const existing = await tx.leads.findUnique({
            where: { id: bigintId },
            select: { contact_id: true },
          });

          if (!existing) return null;

          // Actualiza el correo y el teléfono en core.contacts.
          if (data.email !== undefined || data.phone !== undefined) {
            await tx.contacts.update({
              where: { id: existing.contact_id },
              data: {
                ...(data.email !== undefined && {
                  email: data.email,
                }),
                ...(data.phone !== undefined && {
                  phone: data.phone,
                }),
                updated_at: new Date(),
              },
            });
          }

          // `company_id` admite NULL: quitar la empresa no inventa una.
          const companyFields =
            data.companyName === undefined
              ? {}
              : {
                  company_id: data.companyName?.trim()
                    ? await findOrCreateCompanyByName(tx, data.companyName)
                    : null,
                };

          // Actualiza los datos propios del lead.
          return tx.leads.update({
            where: { id: bigintId },
            data: {
              ...(data.name !== undefined && {
                title: data.name,
              }),
              ...(data.serviceInterest !== undefined && {
                interested_service: data.serviceInterest,
              }),
              ...(data.notes !== undefined && {
                observations: data.notes,
              }),
              ...(data.ownerUserId !== undefined &&
                data.ownerUserId !== null && {
                  assigned_to:
                    this.toBigInt(data.ownerUserId) ?? undefined,
                }),
              ...companyFields,
              ...statusFields,
              updated_at: new Date(),
            },
            include: LEAD_INCLUDE,
          });
        });

        if (!row) return null;

        const [entity] = await this.attachConvertedIds([
          this.toEntity(row),
        ]);

        return entity;
      } catch (error) {
        // El contrato devuelve null, pero la causa no debe perderse.
        this.logger.error(`No se pudo actualizar el lead ${id}: ${safeErrorSummary(error)}`);
        return null;
      }
    }

  async delete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;

    try {
      // Sin `deleted_at` expuesto por el momento en el contrato -> soft delete real vía columna existente.
      await this.prisma.leads.update({ where: { id: bigintId }, data: { deleted_at: new Date() } });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.prisma.leads.count({ where: { deleted_at: null } });
  }

  // ---------------------------------------------------------------------

  /**
   * Crea empresa, contacto y lead como una sola operación. Un choque del código
   * aleatorio aborta la transacción, así que se reintenta completa (ya se
   * deshizo todo lo anterior).
   */
  private async createInTransaction(
    data: Omit<LeadEntity, 'id' | 'createdAt' | 'updatedAt'>,
    placement: { sourceId: bigint; statusId: bigint; pipelineId: bigint; stageId: bigint },
    assignedTo: bigint,
  ) {
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          if (data.chatSessionId) {
            // Se libera al terminar la transacción. Sin esto, dos peticiones
            // simultáneas de la misma sesión verían "no hay lead" y crearían dos.
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${CHAT_LEAD_LOCK_PREFIX + data.chatSessionId}))`;
            const existing = await tx.leads.findFirst({
              where: { campaign: data.chatSessionId, deleted_at: null },
              include: LEAD_INCLUDE,
              orderBy: { id: 'asc' },
            });
            if (existing) return existing;
          }

          const companyId = data.companyName?.trim() ? await findOrCreateCompanyByName(tx, data.companyName) : null;
          const contactId = await findOrCreateContactByEmail(tx, {
            name: data.name,
            email: data.email,
            phone: data.phone,
            companyId,
          });

          return tx.leads.create({
            data: {
              code: generateLeadCode(),
              company_id: companyId,
              contact_id: contactId,
              assigned_to: assignedTo,
              created_by: assignedTo,
              source_id: placement.sourceId,
              status_id: placement.statusId,
              pipeline_id: placement.pipelineId,
              stage_id: placement.stageId,
              title: data.name,
              interested_service: data.serviceInterest,
              observations: data.notes,
              campaign: data.chatSessionId,
            },
            include: LEAD_INCLUDE,
          });
        }, LEAD_TRANSACTION_OPTIONS);
      } catch (error) {
        if (attempt >= MAX_LEAD_CODE_ATTEMPTS || !isLeadCodeClash(error)) throw error;
      }
    }
  }

  private async resolvePipelinePlacement(
    source: LeadSource,
    status: LeadStatus,
  ): Promise<{ sourceId: bigint; statusId: bigint; pipelineId: bigint; stageId: bigint }> {
    const sourceName = SOURCE_TO_REAL_NAME[source];
    const sourceRow = await this.prisma.lead_sources.findFirst({ where: { name: sourceName }, select: { id: true } });
    if (!sourceRow) throw missingCatalogError(`Falta la fuente "${sourceName}" en crm.lead_sources`);

    const { statusId, pipelineId, stageId } = await this.resolveStatusPlacementRaw(status);
    return { sourceId: sourceRow.id, statusId, pipelineId, stageId };
  }

  private async resolveStatusPlacementRaw(
    status: LeadStatus,
  ): Promise<{ statusId: bigint; pipelineId: bigint; stageId: bigint }> {
    const { status: statusName, stage: stageName } = STATUS_TO_REAL[status];
    const [statusRow, pipeline] = await Promise.all([
      this.prisma.lead_statuses.findFirst({ where: { name: statusName }, select: { id: true } }),
      this.prisma.pipelines.findFirst({
        where: { is_default: true, is_active: true },
        orderBy: { id: 'asc' },
        select: { id: true },
      }),
    ]);
    if (!statusRow) throw missingCatalogError(`Falta el estado "${statusName}" en crm.lead_statuses`);
    if (!pipeline) throw missingCatalogError('No hay un pipeline predeterminado activo en crm.pipelines');

    const stage = await this.prisma.pipeline_stages.findFirst({
      where: { pipeline_id: pipeline.id, name: stageName },
      select: { id: true },
    });
    if (!stage) throw missingCatalogError(`Falta la etapa "${stageName}" en crm.pipeline_stages`);

    return { statusId: statusRow.id, pipelineId: pipeline.id, stageId: stage.id };
  }

  private async resolveStatusPlacement(status: LeadStatus) {
    const { statusId, stageId } = await this.resolveStatusPlacementRaw(status);
    return {
      status_id: statusId,
      stage_id: stageId,
      ...(status === 'CONVERTED' && { is_converted: true, converted_at: new Date() }),
    };
  }

  /** Rellena `convertedToOpportunityId` consultando `crm.opportunities.source_lead_id` en una sola consulta. */
  private async attachConvertedIds(entities: LeadEntity[]): Promise<LeadEntity[]> {
    const convertedIds = entities.filter((e) => e.status === 'CONVERTED').map((e) => BigInt(e.id));
    if (convertedIds.length === 0) return entities;

    const opportunities = await this.prisma.opportunities.findMany({
      where: { source_lead_id: { in: convertedIds } },
      select: { id: true, source_lead_id: true },
    });
    const byLeadId = new Map(opportunities.map((o) => [o.source_lead_id!.toString(), o.id.toString()]));

    return entities.map((entity) => {
      const opportunityId = byLeadId.get(entity.id);
      if (opportunityId) entity.convertedToOpportunityId = opportunityId;
      return entity;
    });
  }

  private toEntity(row: LeadRow): LeadEntity {
    const entity = new LeadEntity();
    entity.id = row.id.toString();
    entity.name = row.title;
    entity.email = row.contacts_leads_contact_idTocontacts?.email ?? null;
    entity.phone = row.contacts_leads_contact_idTocontacts?.phone ?? null;
    entity.companyName = row.companies_leads_company_idTocompanies?.legal_name ?? null;
    entity.source = row.lead_sources ? (REAL_NAME_TO_SOURCE[row.lead_sources.name] ?? 'MANUAL') : 'MANUAL';
    entity.serviceInterest = row.interested_service;
    entity.status = row.lead_statuses ? (REAL_STATUS_NAME_TO_APP[row.lead_statuses.name] ?? 'NEW') : 'NEW';
    entity.ownerUserId = row.users_leads_assigned_toTousers?.id.toString() ?? null;
    entity.notes = row.observations;
    entity.chatSessionId = row.campaign;
    entity.convertedToOpportunityId = null;
    entity.createdAt = row.created_at ?? new Date(0);
    entity.updatedAt = row.updated_at ?? new Date(0);
    return entity;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }
}
