import { api } from "@/lib/api/axios";

export const OPPORTUNITY_STAGES = ["NEW", "QUALIFYING", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const;
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

export interface ApiOpportunity {
  id: string;
  title: string;
  companyId: string | null;
  contactId: string | null;
  value: number;
  currency: string;
  stage: OpportunityStage;
  probability: number | null;
  ownerUserId: string | null;
  expectedCloseDate: string | null;
  sourceLeadId: string | null;
  closedAt: string | null;
  closeReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityInput {
  title: string;
  companyId?: string;
  contactId?: string;
  value?: number;
  currency?: string;
  stage?: OpportunityStage;
  probability?: number;
  ownerUserId?: string;
  expectedCloseDate?: string;
  sourceLeadId?: string;
}

export interface PipelineColumn {
  stage: OpportunityStage;
  count: number;
  totalValue: number;
  opportunities: ApiOpportunity[];
}

/** Consume `/api/v1/crm/opportunities/**` y `/api/v1/crm/pipeline` (backend NestJS). */
export const opportunitiesService = {
  getAll: (stage?: OpportunityStage) =>
    api
      .get<{ data: ApiOpportunity[] }>("/crm/opportunities", { params: stage ? { stage } : undefined })
      .then((res) => res.data.data),

  getOne: (id: string) =>
    api.get<{ data: ApiOpportunity }>(`/crm/opportunities/${id}`).then((res) => res.data.data),

  create: (data: OpportunityInput) =>
    api.post<{ data: ApiOpportunity }>("/crm/opportunities", data).then((res) => res.data.data),

  update: (id: string, data: Partial<OpportunityInput>) =>
    api.patch<{ data: ApiOpportunity }>(`/crm/opportunities/${id}`, data).then((res) => res.data.data),

  assign: (id: string, ownerUserId: string) =>
    api
      .patch<{ data: ApiOpportunity }>(`/crm/opportunities/${id}/assign`, { ownerUserId })
      .then((res) => res.data.data),

  changeStage: (id: string, stage: OpportunityStage) =>
    api
      .patch<{ data: ApiOpportunity }>(`/crm/opportunities/${id}/stage`, { stage })
      .then((res) => res.data.data),

  close: (id: string, outcome: "WON" | "LOST", reason?: string) =>
    api
      .post<{ data: ApiOpportunity }>(`/crm/opportunities/${id}/close`, { outcome, reason })
      .then((res) => res.data.data),

  remove: (id: string) => api.delete(`/crm/opportunities/${id}`),
};

export const pipelineService = {
  getBoard: () => api.get<{ data: PipelineColumn[] }>("/crm/pipeline").then((res) => res.data.data),
};
