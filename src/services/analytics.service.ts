import { api } from "@/lib/api/axios";

export interface AnalyticsOverview {
  pageviews: number;
  visits: number;
  identifiedPageviews: number;
  visitors: number;
  sessions: number;
  engagedSessions: number;
  measurableSessions: number;
  avgSessionSeconds: number | null;
  events: number;
  conversions: number;
}

export interface AnalyticsReport {
  range: { from: string; to: string; days: number; timezone: string };
  previousRange: { from: string; to: string } | null;
  generatedAt: string;
  lastEventAt: string | null;
  granularity: "hour" | "day";
  overview: AnalyticsOverview;
  previousOverview: AnalyticsOverview | null;
  timeseries: { bucket: string; pageviews: number; visits: number; visitors: number; sessions: number }[];
  sources: { channel: string; visits: number; conversions: number }[];
  referrers: { host: string; visits: number }[];
  campaigns: { campaign: string; source: string | null; medium: string | null; visits: number; conversions: number }[];
  devices: { key: string | null; visits: number }[];
  browsers: { key: string | null; visits: number }[];
  os: { key: string | null; visits: number }[];
  countries: { key: string | null; visits: number }[];
  events: { name: string; label: string; total: number; sessions: number; conversion: boolean; conversions: number }[];
}

export interface AnalyticsPages {
  page: number;
  pageSize: number;
  total: number;
  totalPageviews: number;
  items: { path: string; pageviews: number; visitors: number; entrances: number; share: number }[];
}

export type AnalyticsExportReport = "daily" | "pages" | "sources" | "campaigns" | "devices" | "events";

/** Consume `/api/v1/analytics/**` (backend NestJS, Etapa 15 — solo agregados, nunca eventos crudos). */
export const analyticsService = {
  getReport: (from: string, to: string, compare = true) =>
    api
      .get<{ data: AnalyticsReport }>("/analytics/report", { params: { from, to, compare } })
      .then((res) => res.data.data),

  getPages: (params: { from: string; to: string; page: number; pageSize: number; search?: string }) =>
    api.get<{ data: AnalyticsPages }>("/analytics/pages", { params }).then((res) => res.data.data),

  /** CSV autenticado: se descarga como blob (un `<a href>` no adjunta el token). */
  exportCsv: async (report: AnalyticsExportReport, from: string, to: string) => {
    const response = await api.get("/analytics/export", { params: { report, from, to }, responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analitica-${report}-${from}_${to}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
