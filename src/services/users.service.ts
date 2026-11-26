import { api } from "@/lib/api/axios";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roleId: string;
  roleName: string;
  status: "ACTIVE" | "INACTIVE";
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  roleId: string;
  status?: "ACTIVE" | "INACTIVE";
}

export type UpdateUserInput = Partial<CreateUserInput>;

/** Consume `/api/v1/users/**` (backend NestJS). Envelope `{ success, data }`. */
export const usersService = {
  getAll: () => api.get<{ data: ApiUser[] }>("/users").then((res) => res.data.data),

  getById: (id: string) => api.get<{ data: ApiUser }>(`/users/${id}`).then((res) => res.data.data),

  create: (data: CreateUserInput) =>
    api.post<{ data: ApiUser }>("/users", data).then((res) => res.data.data),

  update: (id: string, data: UpdateUserInput) =>
    api.patch<{ data: ApiUser }>(`/users/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/users/${id}`),
};
