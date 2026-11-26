import { api } from "@/lib/api/axios";

export interface ApiContact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  companyId: string | null;
  ownerUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInput {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: string;
  ownerUserId?: string;
}

/** Consume `/api/v1/crm/contacts/**` (backend NestJS). */
export const contactsService = {
  getAll: () => api.get<{ data: ApiContact[] }>("/crm/contacts").then((res) => res.data.data),

  getOne: (id: string) => api.get<{ data: ApiContact }>(`/crm/contacts/${id}`).then((res) => res.data.data),

  create: (data: ContactInput) =>
    api.post<{ data: ApiContact }>("/crm/contacts", data).then((res) => res.data.data),

  update: (id: string, data: Partial<ContactInput>) =>
    api.patch<{ data: ApiContact }>(`/crm/contacts/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/crm/contacts/${id}`),
};
