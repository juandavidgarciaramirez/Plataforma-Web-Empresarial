import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { OpportunityEntity, OpportunityStage } from '../entities/opportunity.entity';
import { OpportunityRepository } from './opportunity.repository.interface';

type OpportunityRow = {
  id: bigint;
  title: string;
  company_id: bigint | null;
  contact_id: bigint | null;
  value: unknown; // Prisma Decimal
  currency: string;
  stage: string;
  probability: number | null;
  owner_user_id: bigint | null;
  expected_close_date: Date | null;
  source_lead_id: bigint | null;
  closed_at: Date | null;
  close_reason: string | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * Implementación real sobre `crm.opportunities` (Etapa 4, tabla nueva —
 * no existía en el esquema real; ver database/migrations/003_crm_catalog.sql).
 * Mapeo casi 1:1 con `OpportunityEntity` porque la tabla se diseñó a partir
 * de esa entidad. `created_by`/`updated_by` existen en la tabla pero no se
 * completan aquí: `OpportunityRepository.create()` no recibe el actor
 * (solo `OpportunitiesService` lo usa para la bitácora de auditoría) — se
 * deja como mejora futura si hiciera falta, la columna es nullable.
 */
@Injectable()
export class PrismaOpportunityRepository implements OpportunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<OpportunityEntity[]> {
    const rows = await this.prisma.opportunities.findMany({ orderBy: { created_at: 'desc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<OpportunityEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.opportunities.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<OpportunityEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OpportunityEntity> {
    const row = await this.prisma.opportunities.create({
      data: {
        title: data.title,
        company_id: this.toBigIntOrNull(data.companyId),
        contact_id: this.toBigIntOrNull(data.contactId),
        source_lead_id: this.toBigIntOrNull(data.sourceLeadId),
        value: data.value,
        currency: data.currency,
        stage: data.stage,
        probability: data.probability,
        owner_user_id: this.toBigIntOrNull(data.ownerUserId),
        expected_close_date: data.expectedCloseDate,
        closed_at: data.closedAt,
        close_reason: data.closeReason,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<OpportunityEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<OpportunityEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.opportunities.update({
        where: { id: bigintId },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.companyId !== undefined && { company_id: this.toBigIntOrNull(data.companyId) }),
          ...(data.contactId !== undefined && { contact_id: this.toBigIntOrNull(data.contactId) }),
          ...(data.value !== undefined && { value: data.value }),
          ...(data.currency !== undefined && { currency: data.currency }),
          ...(data.stage !== undefined && { stage: data.stage }),
          ...(data.probability !== undefined && { probability: data.probability }),
          ...(data.ownerUserId !== undefined && { owner_user_id: this.toBigIntOrNull(data.ownerUserId) }),
          ...(data.expectedCloseDate !== undefined && { expected_close_date: data.expectedCloseDate }),
          ...(data.closedAt !== undefined && { closed_at: data.closedAt }),
          ...(data.closeReason !== undefined && { close_reason: data.closeReason }),
          updated_at: new Date(),
        },
      });
      return this.toEntity(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;

    try {
      await this.prisma.opportunities.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.prisma.opportunities.count();
  }

  private toEntity(row: OpportunityRow): OpportunityEntity {
    const entity = new OpportunityEntity();
    entity.id = row.id.toString();
    entity.title = row.title;
    entity.companyId = row.company_id?.toString() ?? null;
    entity.contactId = row.contact_id?.toString() ?? null;
    entity.value = Number(row.value);
    entity.currency = row.currency;
    entity.stage = row.stage as OpportunityStage;
    entity.probability = row.probability;
    entity.ownerUserId = row.owner_user_id?.toString() ?? null;
    entity.expectedCloseDate = row.expected_close_date;
    entity.sourceLeadId = row.source_lead_id?.toString() ?? null;
    entity.closedAt = row.closed_at;
    entity.closeReason = row.close_reason;
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }

  private toBigIntOrNull(id: string | null | undefined): bigint | null {
    if (!id) return null;
    return this.toBigInt(id);
  }
}
