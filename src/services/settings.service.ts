import { api } from "@/lib/api/axios";

export interface ApiSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  dataType: string | null;
  isPublic: boolean;
  updatedAt: string;
}

/** Consume `/api/v1/settings/**` (backend NestJS real, Etapa 11 — `foundation.system_settings`). */
export const settingsService = {
  getAll: () => api.get<{ data: ApiSetting[] }>("/settings").then((res) => res.data.data),

  update: (key: string, value: string) =>
    api.patch<{ data: ApiSetting }>(`/settings/${key}`, { value }).then((res) => res.data.data),
};
