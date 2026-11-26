import { api } from "@/lib/api/axios";

export type PqrType = "PETICION" | "QUEJA" | "RECLAMO" | "SUGERENCIA";
export type PqrStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface ApiPqr {
  id: string;
  radicado: string;
  type: PqrType;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  description: string;
  status: PqrStatus;
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Consume `/api/v1/pqr/**` (backend NestJS). Las PQR las radica el ciudadano; aquí solo se gestionan. */
export const pqrAdminService = {
  getAll: () => api.get<{ data: ApiPqr[] }>("/pqr").then((res) => res.data.data),

  update: (id: string, data: { status?: PqrStatus; response?: string }) =>
    api.patch<{ data: ApiPqr }>(`/pqr/${id}`, data).then((res) => res.data.data),
};
