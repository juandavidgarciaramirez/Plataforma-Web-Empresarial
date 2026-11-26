import { api } from "@/lib/api/axios";
import {
  Service,
  ServiceFilters,
} from "@/lib/types/service.types";

export const serviceService = {
  getAll: (filters?: ServiceFilters) =>
    api
      .get<Service[]>("/services", {
        params: filters,
      })
      .then((res) => res.data),

  getBySlug: (slug: string) =>
    api
      .get<Service>(`/services/${slug}`)
      .then((res) => res.data),

  create: (data: Partial<Service>) =>
    api
      .post<Service>("/services", data)
      .then((res) => res.data),

  update: (id: string, data: Partial<Service>) =>
    api
      .patch<Service>(`/services/${id}`, data)
      .then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/services/${id}`),
};