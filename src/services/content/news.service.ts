import { api } from "@/lib/api/axios";
import type { ContentStatus } from "./services.service";
import type { MediaImage, MediaRef } from "@/services/media.service";

export interface ApiNews {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string | null;
  coverImageUrl: string | null;
  imageAlt?: string | null;
  coverImageFileId?: string | null;
  gallery?: MediaImage[];
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsInput {
  slug: string;
  title: string;
  summary: string;
  content: string;
  category?: string;
  coverImageUrl?: string;
  /** Id de la imagen subida (POST /media/images); null la quita. */
  coverImageFileId?: string | null;
  imageAlt?: string | null;
  galleryImages?: MediaRef[];
  status?: ContentStatus;
}

/** Consume `/api/v1/news/**` (backend NestJS). */
export const newsService = {
  getAll: () => api.get<{ data: ApiNews[] }>("/news").then((res) => res.data.data),

  create: (data: NewsInput) => api.post<{ data: ApiNews }>("/news", data).then((res) => res.data.data),

  update: (id: string, data: Partial<NewsInput>) =>
    api.patch<{ data: ApiNews }>(`/news/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/news/${id}`),
};
