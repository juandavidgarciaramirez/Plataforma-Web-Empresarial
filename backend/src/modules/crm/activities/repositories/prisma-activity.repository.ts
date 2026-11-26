import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { ActivityEntity, ActivityType } from '../entities/activity.entity';
import { ActivityRepository } from './activity.repository.interface';
import { CrmEntityType } from '../../common/crm.types';

type ActivityRow = {
  id: bigint;
  type: string;
  description: string;
  author_user_id: bigint | null;
  occurred_at: Date;
  related_type: string | null;
  related_id: bigint | null;
  created_at: Date;
  updated_at: Date;
};

/** Implementación real sobre `crm.activities` (Etapa 6, tabla nueva — no existía). */
@Injectable()
export class PrismaActivityRepository implements ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ActivityEntity[]> {
    const rows = await this.prisma.activities.findMany({ orderBy: { occurred_at: 'desc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<ActivityEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.activities.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<ActivityEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActivityEntity> {
    const row = await this.prisma.activities.create({
      data: {
        type: data.type,
        description: data.description,
        author_user_id: this.toBigIntOrNull(data.authorUserId),
        occurred_at: data.occurredAt,
        related_type: data.relatedType,
        related_id: this.toBigIntOrNull(data.relatedId),
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<ActivityEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ActivityEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.activities.update({
        where: { id: bigintId },
        data: {
          ...(data.type !== undefined && { type: data.type }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.authorUserId !== undefined && { author_user_id: this.toBigIntOrNull(data.authorUserId) }),
          ...(data.occurredAt !== undefined && { occurred_at: data.occurredAt }),
          ...(data.relatedType !== undefined && { related_type: data.relatedType }),
          ...(data.relatedId !== undefined && { related_id: this.toBigIntOrNull(data.relatedId) }),
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
      await this.prisma.activities.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.prisma.activities.count();
  }

  private toEntity(row: ActivityRow): ActivityEntity {
    const entity = new ActivityEntity();
    entity.id = row.id.toString();
    entity.type = row.type as ActivityType;
    entity.description = row.description;
    entity.authorUserId = row.author_user_id?.toString() ?? null;
    entity.occurredAt = row.occurred_at;
    entity.relatedType = row.related_type as CrmEntityType | null;
    entity.relatedId = row.related_id?.toString() ?? null;
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
