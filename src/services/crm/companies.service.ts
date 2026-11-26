import { api } from "@/lib/api/axios";

export type CompanySize = "MICRO" | "SMALL" | "MEDIUM" | "LARGE";
export type CompanyStatus = "ACTIVE" | "INACTIVE";

export interface ApiCompany {
  id: string;
  name: string;
  taxId: string | null;
  industry: string | null;
  sizeSegment: CompanySize | null;
  website: string | null;
  address: string | null;
  phone: string | null;
  ownerUserId: string | null;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInput {
  name: string;
  taxId?: string;
  industry?: string;
  sizeSegment?: CompanySize;
  website?: string;
  address?: string;
  phone?: string;
  ownerUserId?: string;
  status?: CompanyStatus;
}

/** Consume `/api/v1/crm/companies/**` (backend NestJS). */
export const companiesService = {
  getAll: () => api.get<{ data: ApiCompany[] }>("/crm/companies").then((res) => res.data.data),

  getOne: (id: string) => api.get<{ data: ApiCompany }>(`/crm/companies/${id}`).then((res) => res.data.data),

  create: (data: CompanyInput) =>
    api.post<{ data: ApiCompany }>("/crm/companies", data).then((res) => res.data.data),

  update: (id: string, data: Partial<CompanyInput>) =>
    api.patch<{ data: ApiCompany }>(`/crm/companies/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/crm/companies/${id}`),
};
