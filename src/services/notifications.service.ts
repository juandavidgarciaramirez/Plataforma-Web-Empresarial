import { api } from "@/lib/api/axios";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface ApiNotification {
  id: string;
  userId: string;
  title: string;
  message: string | null;
  type: NotificationType;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

/** Consume `/api/v1/notifications/**` (backend NestJS real, Etapa 11 — `foundation.notifications`). Cada usuario ve solo las suyas. */
export const notificationsService = {
  getMine: (onlyUnread?: boolean) =>
    api
      .get<{ data: ApiNotification[] }>("/notifications", { params: onlyUnread ? { unread: "true" } : undefined })
      .then((res) => res.data.data),

  getUnreadCount: () =>
    api.get<{ data: { count: number } }>("/notifications/unread-count").then((res) => res.data.data.count),

  markRead: (id: string) => api.patch(`/notifications/${id}/read`),

  markAllRead: () => api.patch("/notifications/read-all"),
};
