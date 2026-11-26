import { api } from "@/lib/api/axios";

export interface ApiRole {
  id: string;
  name: string;
  description: string;
  permissionKeys: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPermission {
  id: string;
  key: string;
  module: string;
  description: string;
}

export interface CreateRoleInput {
  name: string;
  description: string;
  permissionKeys: string[];
}

export type UpdateRoleInput = Partial<CreateRoleInput>;

/** Consume `/api/v1/roles/**` y `/api/v1/permissions` (backend NestJS). */
export const rolesService = {
  getAll: () => api.get<{ data: ApiRole[] }>("/roles").then((res) => res.data.data),

  create: (data: CreateRoleInput) =>
    api.post<{ data: ApiRole }>("/roles", data).then((res) => res.data.data),

  update: (id: string, data: UpdateRoleInput) =>
    api.patch<{ data: ApiRole }>(`/roles/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/roles/${id}`),
};

export const permissionsService = {
  getAll: () => api.get<{ data: ApiPermission[] }>("/permissions").then((res) => res.data.data),
};
