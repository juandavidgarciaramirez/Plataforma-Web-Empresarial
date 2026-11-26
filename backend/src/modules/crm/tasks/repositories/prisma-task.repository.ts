import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { TaskEntity, TaskPriority, TaskStatus } from '../entities/task.entity';
import { TaskRepository } from './task.repository.interface';
import { CrmEntityType } from '../../common/crm.types';

type TaskRow = {
  id: bigint;
  title: string;
  description: string | null;
  due_date: Date | null;
  assignee_user_id: bigint | null;
  priority: string;
  status: string;
  related_type: string | null;
  related_id: bigint | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * Implementación real sobre `crm.tasks` (Etapa 4, tabla nueva — no existía
 * en el esquema real; ver database/migrations/003_crm_catalog.sql).
 * `related_id` es polimórfico (lead/company/contact/opportunity) -> sin FK
 * física, se guarda como bigint plano (mismo criterio que la tabla).
 */
@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskEntity[]> {
    const rows = await this.prisma.tasks.findMany({ orderBy: { created_at: 'desc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.tasks.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskEntity> {
    const row = await this.prisma.tasks.create({
      data: {
        title: data.title,
        description: data.description,
        due_date: data.dueDate,
        assignee_user_id: this.toBigIntOrNull(data.assigneeUserId),
        priority: data.priority,
        status: data.status,
        related_type: data.relatedType,
        related_id: this.toBigIntOrNull(data.relatedId),
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TaskEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.tasks.update({
        where: { id: bigintId },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.dueDate !== undefined && { due_date: data.dueDate }),
          ...(data.assigneeUserId !== undefined && { assignee_user_id: this.toBigIntOrNull(data.assigneeUserId) }),
          ...(data.priority !== undefined && { priority: data.priority }),
          ...(data.status !== undefined && { status: data.status }),
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
      await this.prisma.tasks.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.prisma.tasks.count();
  }

  private toEntity(row: TaskRow): TaskEntity {
    const entity = new TaskEntity();
    entity.id = row.id.toString();
    entity.title = row.title;
    entity.description = row.description;
    entity.dueDate = row.due_date;
    entity.assigneeUserId = row.assignee_user_id?.toString() ?? null;
    entity.priority = row.priority as TaskPriority;
    entity.status = row.status as TaskStatus;
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
