import { api } from "@/lib/api/axios";
import type { MediaImage, MediaRef } from "@/services/media.service";

export const VACANCY_MODALITIES = ["ONSITE", "REMOTE", "HYBRID"] as const;
export type VacancyModality = (typeof VACANCY_MODALITIES)[number];

export type VacancyStatus = "OPEN" | "CLOSED";

export interface ApiVacancy {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  location: string | null;
  modality: VacancyModality;
  description: string;
  requirements: string | null;
  status: VacancyStatus;
  imageUrl: string | null;
  imageAlt: string | null;
  imageFileId?: string | null;
  gallery?: MediaImage[];
  createdAt: string;
  updatedAt: string;
}

export interface VacancyInput {
  slug: string;
  title: string;
  department?: string;
  location?: string;
  modality?: VacancyModality;
  description: string;
  requirements?: string;
  status?: VacancyStatus;
  imageFileId?: string | null;
  imageAlt?: string | null;
  galleryImages?: MediaRef[];
}

/** Consume `/api/v1/careers/vacancies/**` (backend NestJS). */
export const vacanciesService = {
  getAll: () => api.get<{ data: ApiVacancy[] }>("/careers/vacancies").then((res) => res.data.data),

  create: (data: VacancyInput) =>
    api.post<{ data: ApiVacancy }>("/careers/vacancies", data).then((res) => res.data.data),

  update: (id: string, data: Partial<VacancyInput>) =>
    api.patch<{ data: ApiVacancy }>(`/careers/vacancies/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/careers/vacancies/${id}`),
};
