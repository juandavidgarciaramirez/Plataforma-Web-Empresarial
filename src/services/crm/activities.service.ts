import { api } from "@/lib/api/axios";
import type { CrmEntityType } from "./types";

export const ACTIVITY_TYPES = [
  "CALL",
  "EMAIL",
  "WHATSAPP",
  "MEETING",
  "NOTE",
  "WEB",
  "INSTAGRAM",
  "FACEBOOK",
  "FOLLOW_UP",
  "OTHER",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface ApiActivity {
  id: string;
  type: ActivityType;
  description: string;
  authorUserId: string | null;
  occurredAt: string;
  relatedType: CrmEntityType | null;
  relatedId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityInput {
  type: ActivityType;
  description: string;
  authorUserId?: string;
  occurredAt?: string;
  relatedType?: CrmEntityType;
  relatedId?: string;
}

/** Consume `/api/v1/crm/activities/**` (backend NestJS). Una nota es una actividad de tipo `NOTE`. */
export const activitiesService = {
  getAll: () => api.get<{ data: ApiActivity[] }>("/crm/activities").then((res) => res.data.data),

  getOne: (id: string) => api.get<{ data: ApiActivity }>(`/crm/activities/${id}`).then((res) => res.data.data),

  create: (data: ActivityInput) =>
    api.post<{ data: ApiActivity }>("/crm/activities", data).then((res) => res.data.data),

  update: (id: string, data: Partial<ActivityInput>) =>
    api.patch<{ data: ApiActivity }>(`/crm/activities/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/crm/activities/${id}`),
};
