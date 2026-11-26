import { api } from "@/lib/api/axios";

export interface ApiAuditEntry {
  id: string;
  actorEmail: string;
  action: string;
  description: string;
  createdAt: string;
}

/** Consume `GET /api/v1/audit` (backend NestJS). */
export const auditService = {
  getAll: (filters?: { limit?: number; action?: string }) =>
    api.get<{ data: ApiAuditEntry[] }>("/audit", { params: filters }).then((res) => res.data.data),
};
