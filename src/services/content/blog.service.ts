import { api } from "@/lib/api/axios";
import type { ContentStatus } from "./services.service";
import type { MediaImage, MediaRef } from "@/services/media.service";

export interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string | null;
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

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  category?: string;
  coverImageUrl?: string;
  /** Id de la imagen subida (POST /media/images); null la quita. */
  coverImageFileId?: string | null;
  imageAlt?: string | null;
  galleryImages?: MediaRef[];
  status?: ContentStatus;
}

/** Consume `/api/v1/blog/**` (backend NestJS admin — distinto de la API pública `src/app/api/v1/blog`). */
export const blogAdminService = {
  getAll: () => api.get<{ data: ApiBlogPost[] }>("/blog").then((res) => res.data.data),

  create: (data: BlogPostInput) => api.post<{ data: ApiBlogPost }>("/blog", data).then((res) => res.data.data),

  update: (id: string, data: Partial<BlogPostInput>) =>
    api.patch<{ data: ApiBlogPost }>(`/blog/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/blog/${id}`),
};
