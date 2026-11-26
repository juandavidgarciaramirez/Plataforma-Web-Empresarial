import { api } from "@/lib/api/axios";
import type { MediaImage, MediaRef } from "@/services/media.service";

export type ContentStatus = "PUBLISHED" | "DRAFT";
export type ServiceSize = "MICRO" | "SMALL" | "MEDIUM" | "LARGE";

export interface ApiContentService {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string | null;
  order: number;
  status: ContentStatus;
  imageUrl: string | null;
  imageAlt: string | null;
  imageFileId?: string | null;
  gallery?: MediaImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInput {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon?: string;
  order?: number;
  status?: ContentStatus;
  imageFileId?: string | null;
  imageAlt?: string | null;
  galleryImages?: MediaRef[];
}

/** Consume `/api/v1/services/**` (backend NestJS, admin — no confundir con el sitio público). */
export const contentServicesService = {
  getAll: () => api.get<{ data: ApiContentService[] }>("/services").then((res) => res.data.data),

  create: (data: ServiceInput) =>
    api.post<{ data: ApiContentService }>("/services", data).then((res) => res.data.data),

  update: (id: string, data: Partial<ServiceInput>) =>
    api.patch<{ data: ApiContentService }>(`/services/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/services/${id}`),
};
