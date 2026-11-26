import { api } from "@/lib/api/axios";

export const APPLICATION_STATUSES = ["RECEIVED", "REVIEWED", "REJECTED", "HIRED"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface ApiApplication {
  id: string;
  vacancyId: string | null;
  vacancyTitle: string;
  fullName: string;
  email: string;
  phone: string | null;
  cvUrl: string | null;
  message: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

/** Consume `/api/v1/careers/applications/**` (backend NestJS). */
export const applicationsService = {
  getAll: () => api.get<{ data: ApiApplication[] }>("/careers/applications").then((res) => res.data.data),

  update: (id: string, status: ApplicationStatus) =>
    api.patch<{ data: ApiApplication }>(`/careers/applications/${id}`, { status }).then((res) => res.data.data),
};
