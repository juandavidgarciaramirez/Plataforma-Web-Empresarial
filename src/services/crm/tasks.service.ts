import { api } from "@/lib/api/axios";
import type { CrmEntityType } from "./types";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  assigneeUserId: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  relatedType: CrmEntityType | null;
  relatedId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  assigneeUserId?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  relatedType?: CrmEntityType;
  relatedId?: string;
}

/** Consume `/api/v1/crm/tasks/**` (backend NestJS). */
export const tasksService = {
  getAll: () => api.get<{ data: ApiTask[] }>("/crm/tasks").then((res) => res.data.data),

  getOne: (id: string) => api.get<{ data: ApiTask }>(`/crm/tasks/${id}`).then((res) => res.data.data),

  create: (data: TaskInput) => api.post<{ data: ApiTask }>("/crm/tasks", data).then((res) => res.data.data),

  update: (id: string, data: Partial<TaskInput>) =>
    api.patch<{ data: ApiTask }>(`/crm/tasks/${id}`, data).then((res) => res.data.data),

  assign: (id: string, assigneeUserId: string) =>
    api.patch<{ data: ApiTask }>(`/crm/tasks/${id}/assign`, { assigneeUserId }).then((res) => res.data.data),

  complete: (id: string) =>
    api.patch<{ data: ApiTask }>(`/crm/tasks/${id}`, { status: "COMPLETED" }).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/crm/tasks/${id}`),
};
