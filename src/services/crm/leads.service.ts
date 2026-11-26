import { api } from "@/lib/api/axios";

export type LeadSource = "YURI" | "WEBSITE_FORM" | "REFERRAL" | "MANUAL" | "CHAT" | "PQR";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED";

export interface ApiLead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  source: LeadSource;
  serviceInterest: string | null;
  status: LeadStatus;
  ownerUserId: string | null;
  notes: string | null;
  chatSessionId: string | null;
  convertedToOpportunityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: LeadSource;
  serviceInterest?: string;
  status?: LeadStatus;
  ownerUserId?: string;
  notes?: string;
}

export interface ConvertLeadInput {
  title?: string;
  value?: number;
  companyId?: string;
  contactId?: string;
}

/** Consume `/api/v1/crm/leads/**` (backend NestJS). Los leads de Yuri llegan con `source=YURI`. */
export const leadsService = {
  getAll: (filters?: { source?: LeadSource; status?: LeadStatus }) =>
    api
      .get<{ data: ApiLead[] }>("/crm/leads", { params: filters })
      .then((res) => res.data.data),

  getOne: (id: string) => api.get<{ data: ApiLead }>(`/crm/leads/${id}`).then((res) => res.data.data),

  create: (data: LeadInput) => api.post<{ data: ApiLead }>("/crm/leads", data).then((res) => res.data.data),

  update: (id: string, data: Partial<LeadInput>) =>
    api.patch<{ data: ApiLead }>(`/crm/leads/${id}`, data).then((res) => res.data.data),

  assign: (id: string, ownerUserId: string) =>
    api.patch<{ data: ApiLead }>(`/crm/leads/${id}/assign`, { ownerUserId }).then((res) => res.data.data),

  convert: (id: string, data: ConvertLeadInput = {}) =>
    api.post<{ data: ApiLead }>(`/crm/leads/${id}/convert`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/crm/leads/${id}`),
};
