export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export class NotificationEntity {
  id!: string;
  userId!: string;
  title!: string;
  message!: string | null;
  type!: NotificationType;
  link!: string | null;
  isRead!: boolean;
  createdAt!: Date;
}
