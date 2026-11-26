import { NotificationEntity, NotificationType } from '../entities/notification.entity';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message?: string | null;
  type?: NotificationType;
  link?: string | null;
}

export interface NotificationRepository {
  findAllForUser(userId: string, onlyUnread?: boolean): Promise<NotificationEntity[]>;
  countUnread(userId: string): Promise<number>;
  create(data: CreateNotificationData): Promise<NotificationEntity>;
  markRead(id: string, userId: string): Promise<boolean>;
  markAllRead(userId: string): Promise<number>;
}

export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';
