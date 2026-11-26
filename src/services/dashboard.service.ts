import { api } from "@/lib/api/axios";

export interface DashboardStats {
  leadsNew: number;
  opportunitiesOpen: number;
  pipelineValue: number;
  tasksPending: number;
  pendingPqrs: number;
  recentApplications: number;

  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;

  recentActivities: {
    id: string | number;
    description: string;
    time: string;
  }[];
}

export interface PipelineStagePoint {
  stage: string;
  count: number;
  totalValue: number;
}

export interface LeadsBySourcePoint {
  source: string;
  count: number;
}

export interface LeadsByServicePoint {
  service: string;
  count: number;
}

export interface DashboardCharts {
  pipelineByStage: PipelineStagePoint[];
  leadsBySource: LeadsBySourcePoint[];
  leadsByService: LeadsByServicePoint[];
}

interface AdminActivityResponse {
  recentActivities: { id: string; description: string; time: string }[];
}

/** Consume `GET /api/v1/admin/summary`, `/admin/activity` y `/admin/crm-charts` (backend NestJS). */
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [summaryRes, activityRes] = await Promise.all([
      api.get<{ data: Omit<DashboardStats, "recentActivities"> }>("/admin/summary"),
      api.get<{ data: AdminActivityResponse }>("/admin/activity").catch(() => null),
    ]);

    return {
      ...summaryRes.data.data,
      recentActivities: activityRes?.data.data.recentActivities ?? [],
    };
  },

  getCharts: () => api.get<{ data: DashboardCharts }>("/admin/crm-charts").then((res) => res.data.data),
};
