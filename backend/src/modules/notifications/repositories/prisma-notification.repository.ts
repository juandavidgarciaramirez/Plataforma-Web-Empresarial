import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { NotificationEntity, NotificationType } from '../entities/notification.entity';
import { CreateNotificationData, NotificationRepository } from './notification.repository.interface';

type NotificationRow = {
  id: bigint;
  user_id: bigint;
  title: string;
  message: string | null;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: Date;
};

/** Implementación real sobre `foundation.notifications` (Etapa 11, tabla nueva). */
@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string, onlyUnread = false): Promise<NotificationEntity[]> {
    const bigintId = this.toBigInt(userId);
    if (bigintId === null) return [];
    const rows = await this.prisma.notifications.findMany({
      where: { user_id: bigintId, ...(onlyUnread && { is_read: false }) },
      orderBy: { created_at: 'desc' },
      take: 100,
    });
    return rows.map((row) => this.toEntity(row));
  }

  async countUnread(userId: string): Promise<number> {
    const bigintId = this.toBigInt(userId);
    if (bigintId === null) return 0;
    return this.prisma.notifications.count({ where: { user_id: bigintId, is_read: false } });
  }

  async create(data: CreateNotificationData): Promise<NotificationEntity> {
    const userId = this.toBigInt(data.userId);
    if (userId === null) throw new Error(`userId inválido para notificación: ${data.userId}`);
    const row = await this.prisma.notifications.create({
      data: {
        user_id: userId,
        title: data.title,
        message: data.message ?? null,
        type: data.type ?? 'INFO',
        link: data.link ?? null,
      },
    });
    return this.toEntity(row);
  }

  async markRead(id: string, userId: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    const bigintUserId = this.toBigInt(userId);
    if (bigintId === null || bigintUserId === null) return false;
    const result = await this.prisma.notifications.updateMany({
      where: { id: bigintId, user_id: bigintUserId },
      data: { is_read: true },
    });
    return result.count > 0;
  }

  async markAllRead(userId: string): Promise<number> {
    const bigintUserId = this.toBigInt(userId);
    if (bigintUserId === null) return 0;
    const result = await this.prisma.notifications.updateMany({
      where: { user_id: bigintUserId, is_read: false },
      data: { is_read: true },
    });
    return result.count;
  }

  private toEntity(row: NotificationRow): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = row.id.toString();
    entity.userId = row.user_id.toString();
    entity.title = row.title;
    entity.message = row.message;
    entity.type = row.type as NotificationType;
    entity.link = row.link;
    entity.isRead = row.is_read;
    entity.createdAt = row.created_at;
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
