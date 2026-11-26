"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  Minus,
  RefreshCw,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { Can } from "@/components/atoms/Can";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import {
  analyticsService,
  type AnalyticsExportReport,
  type AnalyticsOverview,
  type AnalyticsReport,
} from "@/services/analytics.service";

/* -------------------------------------------------------------------------- */
/* Periodos (zona horaria del negocio: America/Bogota, igual que el backend)  */
/* -------------------------------------------------------------------------- */

const TIMEZONE = "America/Bogota";

type Preset = "today" | "yesterday" | "7d" | "30d" | "90d" | "month" | "lastMonth" | "custom";

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "yesterday", label: "Ayer" },
  { key: "7d", label: "Últimos 7 días" },
  { key: "30d", label: "Últimos 30 días" },
  { key: "90d", label: "Últimos 90 días" },
  { key: "month", label: "Este mes" },
  { key: "lastMonth", label: "Mes anterior" },
  { key: "custom", label: "Rango personalizado" },
];

function todayInTimezone(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function addDays(date: string, days: number): string {
  const time = Date.parse(`${date}T00:00:00Z`) + days * 86_400_000;
  return new Date(time).toISOString().slice(0, 10);
}

function rangeFor(preset: Preset, custom: { from: string; to: string }): { from: string; to: string } {
  const today = todayInTimezone();
  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "yesterday":
      return { from: addDays(today, -1), to: addDays(today, -1) };
    case "7d":
      return { from: addDays(today, -6), to: today };
    case "30d":
      return { from: addDays(today, -29), to: today };
    case "90d":
      return { from: addDays(today, -89), to: today };
    case "month":
      return { from: `${today.slice(0, 8)}01`, to: today };
    case "lastMonth": {
      const lastDay = addDays(`${today.slice(0, 8)}01`, -1);
      return { from: `${lastDay.slice(0, 8)}01`, to: lastDay };
    }
    case "custom":
      return custom.from <= custom.to ? custom : { from: custom.to, to: custom.from };
  }
}

/* -------------------------------------------------------------------------- */
/* Formato y etiquetas                                                         */
/* -------------------------------------------------------------------------- */

const number = new Intl.NumberFormat("es-CO");
const percent = new Intl.NumberFormat("es-CO", { style: "percent", maximumFractionDigits: 1 });

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} min ${rest} s` : `${minutes} min`;
}

function formatDay(date: string): string {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "sin registros todavía";
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: TIMEZONE }).format(new Date(iso));
}

const CHANNEL_LABELS: Record<string, string> = {
  direct: "Acceso directo",
  organic_search: "Búsqueda orgánica",
  social: "Redes sociales",
  referral: "Sitios de referencia",
  email: "Correo electrónico",
  paid: "Campañas pagadas",
  campaign: "Otras campañas (UTM)",
};

const DEVICE_LABELS: Record<string, string> = { mobile: "Móvil", desktop: "Escritorio", tablet: "Tableta" };

/** Paleta categórica validada (3 series; todas las parejas pasan CVD y visión normal sobre blanco). */
const SERIES = [
  { key: "visits", label: "Visitas", color: "#2a78d6" },
  { key: "visitors", label: "Visitantes únicos*", color: "#eb6834" },
  { key: "sessions", label: "Sesiones*", color: "#1baf7a" },
] as const;

const BAR_COLOR = "#2a78d6";
const GRID_COLOR = "#eef2f6";
const AXIS_TICK = { fontSize: 12, fill: "#64748b" };

/* -------------------------------------------------------------------------- */
/* Página                                                                      */
/* -------------------------------------------------------------------------- */

export default function AnalyticsPage() {
  const [preset, setPreset] = useState<Preset>("30d");
  const [custom, setCustom] = useState(() => ({ from: addDays(todayInTimezone(), -29), to: todayInTimezone() }));
  const [compare, setCompare] = useState(true);
  const range = useMemo(() => rangeFor(preset, custom), [preset, custom]);

  const report = useQuery({
    queryKey: ["analytics-report", range.from, range.to, compare],
    queryFn: () => analyticsService.getReport(range.from, range.to, compare),
    placeholderData: keepPreviousData,
    // Datos vivos: se actualizan solos cada 5 minutos, sin reconstruir el sitio.
    refetchInterval: 5 * 60 * 1000,
    // Sin permiso no tiene sentido reintentar: el error se muestra de inmediato.
    retry: (failureCount, error) => (error as any)?.response?.status !== 403 && failureCount < 2,
  });

  const data = report.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Analítica web</h1>
          <p className="text-muted-foreground">
            Visitas, fuentes de tráfico y conversiones del sitio público, medidas por la plataforma (sin datos personales).
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {data && (
            <span>
              Actualizado: {formatDateTime(data.generatedAt)} · Último registro: {formatDateTime(data.lastEventAt)}
            </span>
          )}
          <button
            type="button"
            onClick={() => report.refetch()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", report.isFetching && "animate-spin")} /> Actualizar
          </button>
        </div>
      </div>

      {/* Filtros: una sola fila sobre todos los gráficos */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-end">
        <div className="space-y-1.5 md:w-56">
          <Label>Periodo</Label>
          <Select value={preset} onValueChange={(value) => setPreset(value as Preset)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {preset === "custom" && (
          <div className="flex gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="analytics-from">Desde</Label>
              <Input
                id="analytics-from"
                type="date"
                value={custom.from}
                max={todayInTimezone()}
                onChange={(e) => e.target.value && setCustom((c) => ({ ...c, from: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="analytics-to">Hasta</Label>
              <Input
                id="analytics-to"
                type="date"
                value={custom.to}
                max={todayInTimezone()}
                onChange={(e) => e.target.value && setCustom((c) => ({ ...c, to: e.target.value }))}
              />
            </div>
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-slate-600 md:pb-2">
          <Switch checked={compare} onCheckedChange={setCompare} />
          Comparar con el periodo anterior
        </label>
        <p className="text-xs text-slate-500 md:ml-auto md:pb-2">
          {formatDay(range.from)} – {formatDay(range.to)}
          {data?.previousRange && ` · vs. ${formatDay(data.previousRange.from)} – ${formatDay(data.previousRange.to)}`}
        </p>
      </div>

      {report.isError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-2">
            <p>No se pudieron cargar las estadísticas. {(report.error as any)?.response?.data?.message ?? "Revisa la conexión con el servidor."}</p>
            <button type="button" onClick={() => report.refetch()} className="font-medium underline">
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!data && report.isLoading && <p className="text-sm text-muted-foreground">Cargando estadísticas…</p>}

      {data && (
        <>
          <ConsentCoverage overview={data.overview} />
          <KpiGrid data={data} />
          <EvolutionCard data={data} />
          <PagesCard from={range.from} to={range.to} />
          <div className="grid gap-6 lg:grid-cols-2">
            <SourcesCard data={data} />
            <DevicesCard data={data} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <CampaignsCard data={data} />
            <GeoCard data={data} />
          </div>
          <EventsCard data={data} />
          <DefinitionsCard />
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Piezas                                                                      */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function ExportButton({ report, from, to }: { report: AnalyticsExportReport; from: string; to: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Can permission="analytics.reports.export">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await analyticsService.exportCsv(report, from, to);
          } catch {
            toast.error("No se pudo exportar el CSV");
          } finally {
            setBusy(false);
          }
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
      >
        <Download className="h-3.5 w-3.5" /> CSV
      </button>
    </Can>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{children}</p>;
}

function ConsentCoverage({ overview }: { overview: AnalyticsOverview }) {
  if (overview.pageviews === 0) return null;
  const coverage = overview.identifiedPageviews / overview.pageviews;
  return (
    <p className="flex items-start gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        El {percent.format(coverage)} de las páginas vistas proviene de visitantes que aceptaron cookies analíticas. Las métricas
        marcadas con * (visitantes, sesiones, duración e interacción) se calculan solo sobre ellos; el resto incluye además, de
        forma anónima, a quienes aún no han decidido. Quien rechaza la medición no se registra.
      </span>
    </p>
  );
}

function change(current: number | null, previous: number | null | undefined): { label: string; direction: "up" | "down" | "flat" } | null {
  if (previous === undefined || previous === null || current === null) return null;
  if (previous === 0) {
    return current === 0
      ? { label: "Sin cambios vs. periodo anterior", direction: "flat" }
      : { label: "Sin datos en el periodo anterior", direction: "up" };
  }
  const delta = (current - previous) / previous;
  if (Math.abs(delta) < 0.005) return { label: "Sin cambios vs. periodo anterior", direction: "flat" };
  return { label: `${delta > 0 ? "+" : ""}${percent.format(delta)} vs. periodo anterior`, direction: delta > 0 ? "up" : "down" };
}

function KpiCard({
  title,
  value,
  current,
  previous,
  note,
}: {
  title: string;
  value: string;
  current: number | null;
  previous?: number | null;
  note?: string;
}) {
  const delta = change(current, previous);
  const Icon = delta?.direction === "up" ? TrendingUp : delta?.direction === "down" ? TrendingDown : Minus;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {delta && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-xs font-medium",
            delta.direction === "up" ? "text-emerald-700" : delta.direction === "down" ? "text-red-700" : "text-slate-500",
          )}
        >
          <Icon className="h-3.5 w-3.5" /> {delta.label}
        </p>
      )}
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

function KpiGrid({ data }: { data: AnalyticsReport }) {
  const o = data.overview;
  const p = data.previousOverview;
  const rate = o.sessions > 0 ? o.engagedSessions / o.sessions : null;
  const previousRate = p && p.sessions > 0 ? p.engagedSessions / p.sessions : p ? null : undefined;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard title="Visitas" value={number.format(o.visits)} current={o.visits} previous={p?.visits} note="Llegadas al sitio (estimado)" />
      <KpiCard title="Visitantes únicos*" value={number.format(o.visitors)} current={o.visitors} previous={p?.visitors} note="Con consentimiento analítico" />
      <KpiCard title="Sesiones*" value={number.format(o.sessions)} current={o.sessions} previous={p?.sessions} note="Cierre tras 30 min sin actividad" />
      <KpiCard title="Páginas vistas" value={number.format(o.pageviews)} current={o.pageviews} previous={p?.pageviews} />
      <KpiCard
        title="Duración promedio*"
        value={formatDuration(o.avgSessionSeconds)}
        current={o.avgSessionSeconds}
        previous={p ? p.avgSessionSeconds : undefined}
        note={o.measurableSessions > 0 ? `Sobre ${number.format(o.measurableSessions)} sesiones medibles` : "Datos insuficientes"}
      />
      <KpiCard
        title="Sesiones con interacción*"
        value={rate === null ? "—" : percent.format(rate)}
        current={rate}
        previous={previousRate}
        note={rate === null ? "Datos insuficientes" : `${number.format(o.engagedSessions)} de ${number.format(o.sessions)} sesiones`}
      />
      <KpiCard title="Conversiones" value={number.format(o.conversions)} current={o.conversions} previous={p?.conversions} note="Acciones comerciales" />
      <KpiCard title="Eventos" value={number.format(o.events)} current={o.events} previous={p?.events} note="Clics y envíos registrados" />
    </div>
  );
}

function EvolutionCard({ data }: { data: AnalyticsReport }) {
  const [asTable, setAsTable] = useState(false);
  const rows = data.timeseries.map((row) => ({ ...row, label: data.granularity === "hour" ? row.bucket : formatDay(row.bucket) }));
  const empty = data.overview.pageviews === 0;
  return (
    <Section
      title="Evolución de visitas"
      description={data.granularity === "hour" ? "Por hora del día (hora de Colombia)" : "Por día (hora de Colombia)"}
      actions={
        <>
          <button
            type="button"
            onClick={() => setAsTable((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Table2 className="h-3.5 w-3.5" /> {asTable ? "Ver gráfico" : "Ver tabla"}
          </button>
          <ExportButton report="daily" from={data.range.from} to={data.range.to} />
        </>
      }
    >
      {empty ? (
        <EmptyState>Aún no hay visitas registradas en este periodo.</EmptyState>
      ) : asTable ? (
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">{data.granularity === "hour" ? "Hora" : "Día"}</th>
                <th className="pb-2 text-right font-medium">Visitas</th>
                <th className="pb-2 text-right font-medium">Visitantes únicos*</th>
                <th className="pb-2 text-right font-medium">Sesiones*</th>
                <th className="pb-2 text-right font-medium">Páginas vistas</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((row) => (
                <tr key={row.bucket} className="border-b last:border-0">
                  <td className="py-1.5">{row.label}</td>
                  <td className="py-1.5 text-right">{number.format(row.visits)}</td>
                  <td className="py-1.5 text-right">{number.format(row.visitors)}</td>
                  <td className="py-1.5 text-right">{number.format(row.sessions)}</td>
                  <td className="py-1.5 text-right">{number.format(row.pageviews)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
              <CartesianGrid vertical={false} stroke={GRID_COLOR} />
              <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: GRID_COLOR }} minTickGap={16} />
              <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
              <Tooltip
                cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
                formatter={(value, name) => [number.format(Number(value)), name]}
                contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 12 }}
              />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, color: "#475569" }} />
              {SERIES.map((series) => (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.label}
                  stroke={series.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Section>
  );
}

function PagesCard({ from, to }: { from: string; to: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => setPage(1), [debounced, from, to]);

  const query = useQuery({
    queryKey: ["analytics-pages", from, to, page, debounced],
    queryFn: () => analyticsService.getPages({ from, to, page, pageSize, search: debounced || undefined }),
    placeholderData: keepPreviousData,
  });
  const data = query.data;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <Section
      title="Páginas más visitadas"
      description="Todas las rutas públicas detectadas en el periodo, incluidas las que se agreguen al sitio."
      actions={<ExportButton report="pages" from={from} to={to} />}
    >
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar una ruta, p. ej. /servicios"
        className="mb-4 md:max-w-sm"
        aria-label="Buscar página"
      />
      {query.isError ? (
        <EmptyState>No se pudo cargar el listado de páginas.</EmptyState>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : data.items.length === 0 ? (
        <EmptyState>{debounced ? "Ninguna ruta coincide con la búsqueda." : "Aún no hay páginas vistas en este periodo."}</EmptyState>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-2 font-medium">Página</th>
                  <th className="pb-2 text-right font-medium">Visitas a la página</th>
                  <th className="pb-2 text-right font-medium">Visitantes únicos*</th>
                  <th className="hidden pb-2 font-medium sm:table-cell sm:pl-6">% del total</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {data.items.map((row) => (
                  <tr key={row.path} className="border-b last:border-0">
                    <td className="max-w-[16rem] truncate py-2 font-medium text-slate-900" title={row.path}>
                      {row.path}
                    </td>
                    <td className="py-2 text-right">{number.format(row.pageviews)}</td>
                    <td className="py-2 text-right">{number.format(row.visitors)}</td>
                    <td className="hidden py-2 sm:table-cell sm:pl-6">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full" style={{ width: `${row.share * 100}%`, background: BAR_COLOR }} />
                        </div>
                        <span className="text-slate-600">{percent.format(row.share)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              {number.format(data.total)} rutas · {number.format(data.totalPageviews)} páginas vistas en total
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </Section>
  );
}

function SourcesCard({ data }: { data: AnalyticsReport }) {
  const rows = data.sources.map((row) => ({ ...row, label: CHANNEL_LABELS[row.channel] ?? row.channel }));
  const totalVisits = rows.reduce((sum, row) => sum + row.visits, 0);
  return (
    <Section
      title="Fuentes de tráfico"
      description="Canal de llegada según el sitio de origen y los parámetros UTM."
      actions={<ExportButton report="sources" from={data.range.from} to={data.range.to} />}
    >
      {rows.length === 0 ? (
        <EmptyState>Sin visitas en este periodo.</EmptyState>
      ) : (
        <>
          <div style={{ height: Math.max(120, rows.length * 36 + 24) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }} barCategoryGap={8}>
                <CartesianGrid horizontal={false} stroke={GRID_COLOR} />
                <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="label" width={150} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  formatter={(value) => [number.format(Number(value)), "Visitas"]}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 12 }}
                />
                <Bar dataKey="visits" name="Visitas" fill={BAR_COLOR} radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Canal</th>
                <th className="pb-2 text-right font-medium">Visitas</th>
                <th className="pb-2 text-right font-medium">%</th>
                <th className="pb-2 text-right font-medium">Conversiones</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((row) => (
                <tr key={row.channel} className="border-b last:border-0">
                  <td className="py-1.5">{row.label}</td>
                  <td className="py-1.5 text-right">{number.format(row.visits)}</td>
                  <td className="py-1.5 text-right">{totalVisits ? percent.format(row.visits / totalVisits) : "—"}</td>
                  <td className="py-1.5 text-right">{number.format(row.conversions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {data.referrers.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Sitios de origen</h3>
          <ul className="space-y-1 text-sm">
            {data.referrers.map((row) => (
              <li key={row.host} className="flex justify-between gap-4 border-b border-slate-100 py-1 last:border-0">
                <span className="truncate text-slate-700">{row.host}</span>
                <span className="tabular-nums text-slate-600">{number.format(row.visits)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

function BreakdownList({ rows, labelOf }: { rows: { key: string | null; visits: number }[]; labelOf?: (key: string) => string }) {
  const total = rows.reduce((sum, row) => sum + row.visits, 0);
  const max = Math.max(...rows.map((row) => row.visits), 1);
  return (
    <ul className="space-y-2 text-sm">
      {rows.slice(0, 6).map((row) => {
        const label = row.key ? (labelOf ? labelOf(row.key) : row.key) : "Sin dato";
        return (
          <li key={row.key ?? "none"} title={`${label}: ${number.format(row.visits)} visitas`}>
            <div className="flex justify-between gap-4">
              <span className="text-slate-700">{label}</span>
              <span className="tabular-nums text-slate-600">
                {number.format(row.visits)} · {total ? percent.format(row.visits / total) : "—"}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full" style={{ width: `${(row.visits / max) * 100}%`, background: BAR_COLOR }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function DevicesCard({ data }: { data: AnalyticsReport }) {
  const devices = data.devices.filter((row) => row.visits > 0);
  const total = devices.reduce((sum, row) => sum + row.visits, 0);
  return (
    <Section
      title="Dispositivos y navegadores"
      description="Proporción de visitas por tipo de dispositivo."
      actions={<ExportButton report="devices" from={data.range.from} to={data.range.to} />}
    >
      {devices.length === 0 ? (
        <EmptyState>Sin visitas en este periodo.</EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices.map((row) => ({ name: DEVICE_LABELS[row.key ?? ""] ?? "Sin dato", value: row.visits }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {devices.map((row, index) => (
                      <Cell key={row.key ?? index} fill={SERIES[index % SERIES.length].color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${number.format(Number(value))} visitas`, name]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {devices.map((row, index) => (
                <li key={row.key ?? index} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIES[index % SERIES.length].color }} aria-hidden />
                    {DEVICE_LABELS[row.key ?? ""] ?? "Sin dato"}
                  </span>
                  <span className="tabular-nums text-slate-600">{percent.format(row.visits / total)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Navegadores</h3>
              <BreakdownList rows={data.browsers} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Sistemas operativos</h3>
              <BreakdownList rows={data.os} />
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

function CampaignsCard({ data }: { data: AnalyticsReport }) {
  return (
    <Section
      title="Campañas (UTM)"
      description="Visitas y conversiones de enlaces etiquetados con utm_campaign."
      actions={<ExportButton report="campaigns" from={data.range.from} to={data.range.to} />}
    >
      {data.campaigns.length === 0 ? (
        <EmptyState>
          No hay visitas con parámetros UTM en este periodo. Etiqueta los enlaces de tus campañas, p. ej.
          <code className="mx-1 rounded bg-white px-1">?utm_source=linkedin&amp;utm_medium=social&amp;utm_campaign=sst-2026</code>
        </EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Campaña</th>
                <th className="pb-2 font-medium">Fuente / medio</th>
                <th className="pb-2 text-right font-medium">Visitas</th>
                <th className="pb-2 text-right font-medium">Conversiones</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.campaigns.map((row) => (
                <tr key={`${row.campaign}-${row.source}-${row.medium}`} className="border-b last:border-0">
                  <td className="py-1.5 font-medium text-slate-900">{row.campaign}</td>
                  <td className="py-1.5 text-slate-600">
                    {row.source ?? "—"} / {row.medium ?? "—"}
                  </td>
                  <td className="py-1.5 text-right">{number.format(row.visits)}</td>
                  <td className="py-1.5 text-right">{number.format(row.conversions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

function GeoCard({ data }: { data: AnalyticsReport }) {
  const known = data.countries.filter((row) => row.key);
  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(["es"], { type: "region" });
    } catch {
      return null;
    }
  }, []);
  return (
    <Section title="Ubicación aproximada" description="País de las visitas, solo si la infraestructura del servidor lo informa.">
      {known.length === 0 ? (
        <EmptyState>
          Sin datos de ubicación. El servidor actual no recibe el país del visitante (no se usa geolocalización por IP ni se
          guardan direcciones IP). Se mostrará aquí si el backend se publica detrás de un proxy que lo informe (p. ej. Cloudflare).
        </EmptyState>
      ) : (
        <BreakdownList rows={known} labelOf={(code) => regionNames?.of(code) ?? code} />
      )}
    </Section>
  );
}

function EventsCard({ data }: { data: AnalyticsReport }) {
  return (
    <Section
      title="Eventos y conversiones"
      description="Una conversión es una acción comercial: contacto por formulario, WhatsApp o correo comercial, o cotización completada con Yuri."
      actions={<ExportButton report="events" from={data.range.from} to={data.range.to} />}
    >
      {data.events.length === 0 ? (
        <EmptyState>Aún no hay eventos registrados en este periodo.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Evento</th>
                <th className="pb-2 text-right font-medium">Total</th>
                <th className="pb-2 text-right font-medium">Sesiones*</th>
                <th className="pb-2 text-right font-medium">Conversiones</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.events.map((row) => (
                <tr key={row.name} className="border-b last:border-0">
                  <td className="py-2">
                    <span className="font-medium text-slate-900">{row.label}</span>
                    {row.conversion && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Conversión</span>
                    )}
                    <span className="block text-xs text-slate-400">{row.name}</span>
                  </td>
                  <td className="py-2 text-right">{number.format(row.total)}</td>
                  <td className="py-2 text-right">{number.format(row.sessions)}</td>
                  <td className="py-2 text-right">{row.conversion ? number.format(row.conversions) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

function DefinitionsCard() {
  const items: [string, string][] = [
    ["Páginas vistas", "Cada vez que se muestra una página pública (también al navegar sin recargar). Excluye el panel, el inicio de sesión, la API, archivos estáticos, bots, el tráfico interno del equipo y a quienes rechazaron la medición."],
    ["Visitas", "Llegadas al sitio: primera página vista de una entrada desde otro sitio, un buscador, un enlace directo o una campaña. Las recargas y el botón «atrás» no cuentan. Es una estimación."],
    ["Visitantes únicos*", "Identificadores aleatorios distintos (seudónimos, sin nombre, correo, teléfono ni IP). Solo existen si el visitante aceptó cookies analíticas; un mismo visitante en otro navegador o dispositivo cuenta de nuevo."],
    ["Sesiones*", "Periodo de navegación de un visitante con consentimiento. Termina tras 30 minutos sin actividad o cuando llega por una campaña distinta."],
    ["Duración promedio*", "Promedio del tiempo entre la primera y la última actividad de las sesiones con al menos dos señales (navegación, clic o salida de la pestaña). Las sesiones de una sola señal no tienen duración medible y no entran en el promedio."],
    ["Sesiones con interacción*", "Porcentaje de sesiones con 2 o más páginas vistas, al menos un evento, o 10 segundos o más de duración. Es una definición propia: no equivale a la «tasa de interacción» ni al «rebote» de Google Analytics."],
    ["Conversiones", "Acciones comerciales: formulario de contacto enviado, clic en WhatsApp o en el correo comercial, y cotización completada con Yuri (registrada en el CRM)."],
    ["Fuentes de tráfico", "Se clasifican por el sitio de origen y los parámetros UTM de la llegada: búsqueda orgánica, redes sociales, sitios de referencia, correo, campañas pagadas, otras campañas UTM o acceso directo."],
  ];
  return (
    <Section title="¿Cómo se calculan estas métricas?">
      <dl className="grid gap-4 text-sm md:grid-cols-2">
        {items.map(([term, definition]) => (
          <div key={term}>
            <dt className="font-semibold text-slate-800">{term}</dt>
            <dd className="mt-1 text-slate-600">{definition}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-slate-500">
        * Solo visitantes con consentimiento de cookies analíticas. Los datos se conservan por un periodo configurable (por defecto 13
        meses) y luego se eliminan automáticamente.
      </p>
    </Section>
  );
}
