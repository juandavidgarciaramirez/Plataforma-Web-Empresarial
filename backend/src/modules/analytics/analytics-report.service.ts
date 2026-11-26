import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ANALYTICS_EVENTS, AnalyticsEventName, analyticsTimezone } from './analytics.constants';
import { ExportReport } from './dto/report-query.dto';

/** Rango máximo consultable de una vez (días). */
const MAX_RANGE_DAYS = 400;

export interface Overview {
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

interface Range {
  from: string;
  to: string;
  days: number;
}

/**
 * Consultas agregadas del panel de Analítica web. Todo se calcula en
 * PostgreSQL (nunca se envían eventos crudos al navegador). Compatible con
 * PostgreSQL 10: los días se agrupan con `AT TIME ZONE`, no con
 * `date_trunc(..., zona)` (PG12+).
 */
@Injectable()
export class AnalyticsReportService {
  constructor(private readonly prisma: PrismaService) {}

  async report(from: string, to: string, compare: boolean) {
    const range = this.range(from, to);
    const previous = compare ? this.previousRange(range) : null;

    const [overview, previousOverview, timeseries, sources, referrers, campaigns, devices, browsers, os, countries, events, lastEvent] =
      await Promise.all([
        this.overview(range),
        previous ? this.overview(previous) : Promise.resolve(null),
        this.timeseries(range),
        this.sources(range),
        this.referrers(range),
        this.campaigns(range),
        this.breakdown(range, Prisma.sql`device_type`),
        this.breakdown(range, Prisma.sql`browser`),
        this.breakdown(range, Prisma.sql`os`),
        this.breakdown(range, Prisma.sql`country`),
        this.events(range),
        this.prisma.analytics_events.aggregate({ _max: { occurred_at: true } }),
      ]);

    return {
      range: { from: range.from, to: range.to, days: range.days, timezone: analyticsTimezone() },
      previousRange: previous ? { from: previous.from, to: previous.to } : null,
      generatedAt: new Date().toISOString(),
      lastEventAt: lastEvent._max.occurred_at?.toISOString() ?? null,
      granularity: range.days === 1 ? 'hour' : 'day',
      overview,
      previousOverview,
      timeseries,
      sources,
      referrers,
      campaigns,
      devices,
      browsers,
      os,
      countries,
      events,
    };
  }

  async pages(from: string, to: string, page = 1, pageSize = 10, search = '') {
    const range = this.range(from, to);
    const term = search.trim().toLowerCase();
    const filter = term ? Prisma.sql`AND position(${term} in lower(path)) > 0` : Prisma.empty;
    const [rows, totals] = await Promise.all([
      this.prisma.$queryRaw<{ path: string; pageviews: number; visitors: number; entrances: number }[]>`
        SELECT path,
               count(*)::int AS pageviews,
               count(DISTINCT visitor_id)::int AS visitors,
               count(*) FILTER (WHERE is_entrance)::int AS entrances
        FROM analytics.events
        WHERE event_type = 'pageview' AND ${this.between(range)} ${filter}
        GROUP BY path
        ORDER BY pageviews DESC, path
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
      this.prisma.$queryRaw<{ paths: number; pageviews: number }[]>`
        SELECT count(DISTINCT path)::int AS paths,
               count(*)::int AS pageviews
        FROM analytics.events
        WHERE event_type = 'pageview' AND ${this.between(range)} ${filter}`,
      ]);
    const allPageviews = term ? (await this.overview(range)).pageviews : totals[0].pageviews;
    return {
      page,
      pageSize,
      total: totals[0].paths,
      totalPageviews: allPageviews,
      items: rows.map((row) => ({ ...row, share: allPageviews > 0 ? row.pageviews / allPageviews : 0 })),
    };
  }

  async exportCsv(report: ExportReport, from: string, to: string): Promise<string> {
    const range = this.range(from, to);
    switch (report) {
      case 'daily': {
        const rows = await this.timeseries(range);
        return toCsv(['Periodo', 'Páginas vistas', 'Visitas', 'Visitantes únicos*', 'Sesiones*'], rows.map((r) => [r.bucket, r.pageviews, r.visits, r.visitors, r.sessions]));
      }
      case 'pages': {
        const data = await this.pages(from, to, 1, 10_000);
        return toCsv(
          ['Ruta', 'Páginas vistas', 'Visitantes únicos*', 'Entradas', '% del total'],
          data.items.map((r) => [r.path, r.pageviews, r.visitors, r.entrances, (r.share * 100).toFixed(2)]),
        );
      }
      case 'sources': {
        const rows = await this.sources(range);
        return toCsv(['Canal', 'Visitas', 'Conversiones'], rows.map((r) => [r.channel, r.visits, r.conversions]));
      }
      case 'campaigns': {
        const rows = await this.campaigns(range, 1000);
        return toCsv(
          ['Campaña (utm_campaign)', 'Fuente (utm_source)', 'Medio (utm_medium)', 'Visitas', 'Conversiones'],
          rows.map((r) => [r.campaign, r.source ?? '', r.medium ?? '', r.visits, r.conversions]),
        );
      }
      case 'devices': {
        const [devices, browsers, os] = await Promise.all([
          this.breakdown(range, Prisma.sql`device_type`),
          this.breakdown(range, Prisma.sql`browser`),
          this.breakdown(range, Prisma.sql`os`),
        ]);
        return toCsv(['Dimensión', 'Valor', 'Visitas'], [
          ...devices.map((r) => ['Dispositivo', r.key ?? 'Sin dato', r.visits]),
          ...browsers.map((r) => ['Navegador', r.key ?? 'Sin dato', r.visits]),
          ...os.map((r) => ['Sistema operativo', r.key ?? 'Sin dato', r.visits]),
        ]);
      }
      case 'events': {
        const rows = await this.events(range);
        return toCsv(
          ['Evento', 'Descripción', 'Total', 'Sesiones*', 'Es conversión', 'Conversiones'],
          rows.map((r) => [r.name, r.label, r.total, r.sessions, r.conversion ? 'Sí' : 'No', r.conversions]),
        );
      }
    }
  }

  /* ----------------------------------------------------------------------- */

  private async overview(range: Range): Promise<Overview> {
    const [events, sessions] = await Promise.all([
      this.prisma.$queryRaw<
        { pageviews: number; visits: number; identified: number; visitors: number; events: number; conversions: number }[]
      >`
        SELECT count(*) FILTER (WHERE event_type = 'pageview')::int AS pageviews,
               count(*) FILTER (WHERE event_type = 'pageview' AND is_entrance)::int AS visits,
               count(*) FILTER (WHERE event_type = 'pageview' AND visitor_id IS NOT NULL)::int AS identified,
               count(DISTINCT visitor_id)::int AS visitors,
               count(*) FILTER (WHERE event_type = 'event')::int AS events,
               count(*) FILTER (WHERE is_conversion)::int AS conversions
        FROM analytics.events
        WHERE ${this.between(range)}`,
      this.prisma.$queryRaw<{ sessions: number; engaged: number; measurable: number; avg_seconds: number | null }[]>`
        SELECT count(*)::int AS sessions,
               count(*) FILTER (
                 WHERE pageviews >= 2 OR events >= 1 OR last_activity_at - started_at >= interval '10 seconds'
               )::int AS engaged,
               count(*) FILTER (WHERE last_activity_at > started_at)::int AS measurable,
               (avg(extract(epoch FROM last_activity_at - started_at)) FILTER (WHERE last_activity_at > started_at))::float8 AS avg_seconds
        FROM analytics.sessions
        WHERE ${this.between(range, Prisma.sql`started_at`)}`,
    ]);
    const e = events[0];
    const s = sessions[0];
    return {
      pageviews: e.pageviews,
      visits: e.visits,
      identifiedPageviews: e.identified,
      visitors: e.visitors,
      sessions: s.sessions,
      engagedSessions: s.engaged,
      measurableSessions: s.measurable,
      avgSessionSeconds: s.avg_seconds === null ? null : Math.round(s.avg_seconds),
      events: e.events,
      conversions: e.conversions,
    };
  }

  /** Serie temporal sin huecos: por hora si el rango es de un día, si no por día. */
  private async timeseries(range: Range) {
    const tz = analyticsTimezone();
    if (range.days === 1) {
      return this.prisma.$queryRaw<{ bucket: string; pageviews: number; visits: number; visitors: number; sessions: number }[]>`
        SELECT lpad(h::text, 2, '0') || ':00' AS bucket,
               coalesce(e.pageviews, 0)::int AS pageviews,
               coalesce(e.visits, 0)::int AS visits,
               coalesce(e.visitors, 0)::int AS visitors,
               coalesce(s.sessions, 0)::int AS sessions
        FROM generate_series(0, 23) AS h
        LEFT JOIN (
          SELECT extract(hour FROM occurred_at AT TIME ZONE ${tz})::int AS hour,
                 count(*) FILTER (WHERE event_type = 'pageview') AS pageviews,
                 count(*) FILTER (WHERE event_type = 'pageview' AND is_entrance) AS visits,
                 count(DISTINCT visitor_id) AS visitors
          FROM analytics.events WHERE ${this.between(range)} GROUP BY 1
        ) e ON e.hour = h
        LEFT JOIN (
          SELECT extract(hour FROM started_at AT TIME ZONE ${tz})::int AS hour, count(*) AS sessions
          FROM analytics.sessions WHERE ${this.between(range, Prisma.sql`started_at`)} GROUP BY 1
        ) s ON s.hour = h
        ORDER BY h`;
    }
    return this.prisma.$queryRaw<{ bucket: string; pageviews: number; visits: number; visitors: number; sessions: number }[]>`
      SELECT to_char(d, 'YYYY-MM-DD') AS bucket,
             coalesce(e.pageviews, 0)::int AS pageviews,
             coalesce(e.visits, 0)::int AS visits,
             coalesce(e.visitors, 0)::int AS visitors,
             coalesce(s.sessions, 0)::int AS sessions
      FROM generate_series(${range.from}::date, ${range.to}::date, interval '1 day') AS d
      LEFT JOIN (
        SELECT (occurred_at AT TIME ZONE ${tz})::date AS day,
               count(*) FILTER (WHERE event_type = 'pageview') AS pageviews,
               count(*) FILTER (WHERE event_type = 'pageview' AND is_entrance) AS visits,
               count(DISTINCT visitor_id) AS visitors
        FROM analytics.events WHERE ${this.between(range)} GROUP BY 1
      ) e ON e.day = d::date
      LEFT JOIN (
        SELECT (started_at AT TIME ZONE ${tz})::date AS day, count(*) AS sessions
        FROM analytics.sessions WHERE ${this.between(range, Prisma.sql`started_at`)} GROUP BY 1
      ) s ON s.day = d::date
      ORDER BY d`;
  }

  /** Visitas (entradas) y conversiones por canal de llegada. */
  private sources(range: Range) {
    return this.prisma.$queryRaw<{ channel: string; visits: number; conversions: number }[]>`
      SELECT channel,
             count(*) FILTER (WHERE event_type = 'pageview' AND is_entrance)::int AS visits,
             count(*) FILTER (WHERE is_conversion)::int AS conversions
      FROM analytics.events
      WHERE ${this.between(range)}
      GROUP BY channel
      HAVING count(*) FILTER (WHERE event_type = 'pageview' AND is_entrance) > 0 OR count(*) FILTER (WHERE is_conversion) > 0
      ORDER BY visits DESC, conversions DESC`;
  }

  private referrers(range: Range) {
    return this.prisma.$queryRaw<{ host: string; visits: number }[]>`
      SELECT referrer_host AS host, count(*)::int AS visits
      FROM analytics.events
      WHERE event_type = 'pageview' AND is_entrance AND referrer_host IS NOT NULL AND ${this.between(range)}
      GROUP BY referrer_host
      ORDER BY visits DESC, host
      LIMIT 10`;
  }

  private campaigns(range: Range, limit = 10) {
    return this.prisma.$queryRaw<{ campaign: string; source: string | null; medium: string | null; visits: number; conversions: number }[]>`
      SELECT utm_campaign AS campaign, utm_source AS source, utm_medium AS medium,
             count(*) FILTER (WHERE event_type = 'pageview' AND is_entrance)::int AS visits,
             count(*) FILTER (WHERE is_conversion)::int AS conversions
      FROM analytics.events
      WHERE utm_campaign IS NOT NULL AND ${this.between(range)}
      GROUP BY 1, 2, 3
      ORDER BY visits DESC, conversions DESC
      LIMIT ${limit}`;
  }

  /** Visitas (entradas) por una columna categórica: dispositivo, navegador, sistema o país. */
  private breakdown(range: Range, column: Prisma.Sql) {
    return this.prisma.$queryRaw<{ key: string | null; visits: number }[]>`
      SELECT ${column} AS key, count(*)::int AS visits
      FROM analytics.events
      WHERE event_type = 'pageview' AND is_entrance AND ${this.between(range)}
      GROUP BY 1
      ORDER BY visits DESC`;
  }

  private async events(range: Range) {
    const rows = await this.prisma.$queryRaw<{ name: string; total: number; sessions: number; conversions: number }[]>`
      SELECT event_name AS name,
             count(*)::int AS total,
             count(DISTINCT session_id)::int AS sessions,
             count(*) FILTER (WHERE is_conversion)::int AS conversions
      FROM analytics.events
      WHERE event_type = 'event' AND ${this.between(range)}
      GROUP BY event_name
      ORDER BY total DESC`;
    return rows.map((row) => {
      const definition = ANALYTICS_EVENTS[row.name as AnalyticsEventName];
      return { ...row, label: definition?.label ?? row.name, conversion: definition?.conversion ?? false };
    });
  }

  /** Intervalo [from 00:00, to+1 00:00) en la zona horaria del negocio. */
  private between(range: Range, column: Prisma.Sql = Prisma.sql`occurred_at`): Prisma.Sql {
    const tz = analyticsTimezone();
    return Prisma.sql`${column} >= (${range.from}::date::timestamp AT TIME ZONE ${tz})
      AND ${column} < ((${range.to}::date + 1)::timestamp AT TIME ZONE ${tz})`;
  }

  private range(from: string, to: string): Range {
    const start = parseDate(from);
    const end = parseDate(to);
    if (end < start) throw new BadRequestException('La fecha final debe ser igual o posterior a la inicial');
    const days = Math.round((end - start) / 86_400_000) + 1;
    if (days > MAX_RANGE_DAYS) throw new BadRequestException(`El rango máximo es de ${MAX_RANGE_DAYS} días`);
    return { from, to, days };
  }

  /** Mismo número de días, inmediatamente antes del rango actual. */
  private previousRange(range: Range): Range {
    const start = parseDate(range.from);
    const prevEnd = start - 86_400_000;
    const prevStart = prevEnd - (range.days - 1) * 86_400_000;
    return { from: formatDate(prevStart), to: formatDate(prevEnd), days: range.days };
  }
}

function parseDate(value: string): number {
  const time = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(time) || formatDate(time) !== value) throw new BadRequestException(`Fecha inválida: ${value}`);
  return time;
}

function formatDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

/** CSV con `;` y BOM UTF-8: Excel en configuración regional es-CO lo abre en columnas y con tildes. */
function toCsv(header: string[], rows: (string | number | null)[][]): string {
  const escape = (value: string | number | null) => {
    const text = value === null ? '' : String(value);
    // Evita inyección de fórmulas al abrir el CSV en una hoja de cálculo.
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return /[;"\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return '﻿' + [header, ...rows].map((row) => row.map(escape).join(';')).join('\r\n') + '\r\n';
}
