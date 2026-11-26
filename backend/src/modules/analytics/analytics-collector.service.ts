import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request } from 'express';
import { Prisma } from '../../../prisma/generated';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CollectBatchDto, CollectEventDto } from './dto/collect.dto';
import {
  ANALYTICS_EVENTS,
  isConversion,
  MAX_HITS_PER_SESSION,
  PROP_VALUE_PATTERN,
  SESSION_TIMEOUT_MINUTES,
} from './analytics.constants';
import { Attribution, classifyChannel, DeviceInfo, isBotUserAgent, normalizePath, parseUserAgent, readGeo } from './analytics.utils';

/** Un poco más que el tiempo de espera del navegador, para absorber la latencia de red. */
const SESSION_GRACE_MS = (SESSION_TIMEOUT_MINUTES + 5) * 60 * 1000;
/** Los eventos encolados en el navegador pueden llegar con este retraso como máximo. */
const MAX_EVENT_AGE_MS = 10 * 60 * 1000;

interface Context {
  now: number;
  device: DeviceInfo;
  geo: { country: string | null; region: string | null };
}

/**
 * Recepción de `POST /analytics/collect` (público). Medidas contra abuso y
 * para no registrar datos personales:
 *  - solo orígenes del sitio (`ANALYTICS_ALLOWED_ORIGINS`, por defecto
 *    CORS_ORIGINS) — el tráfico de desarrollo o de entornos de prueba no
 *    entra en la base de producción;
 *  - agentes automatizados descartados por User-Agent;
 *  - DTO estricto (campos desconocidos = rechazo), lista blanca de eventos y
 *    de propiedades, valores solo como identificadores cortos;
 *  - rate limiting por IP en el controlador y tope de registros por sesión;
 *  - no se guarda IP, User-Agent completo, query string ni referente completo.
 */
@Injectable()
export class AnalyticsCollectorService {
  private readonly logger = new Logger('AnalyticsCollector');
  private readonly allowedOrigins: Set<string>;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    const configured = process.env.ANALYTICS_ALLOWED_ORIGINS?.split(',') ?? configService.get<string[]>('corsOrigins') ?? [];
    this.allowedOrigins = new Set(configured.map((origin) => origin.trim().replace(/\/+$/, '')).filter(Boolean));
  }

  async collect(body: unknown, request: Request): Promise<{ accepted: number }> {
    const origin = request.headers.origin;
    if (!origin || !this.allowedOrigins.has(origin)) return { accepted: 0 };

    const userAgent = request.headers['user-agent'] ?? '';
    if (isBotUserAgent(userAgent)) return { accepted: 0 };

    const batch = await this.parseBatch(body);
    const context: Context = { now: Date.now(), device: parseUserAgent(userAgent), geo: readGeo(request.headers) };

    const rows: Prisma.analytics_eventsCreateManyInput[] = [];
    for (const event of batch.events) {
      try {
        const row = await this.processEvent(event, context);
        if (row) rows.push(row);
      } catch (error) {
        this.logger.warn(`Evento de analítica descartado: ${(error as Error).message}`);
      }
    }
    if (rows.length > 0) await this.prisma.analytics_events.createMany({ data: rows });
    return { accepted: rows.length };
  }

  /** El navegador envía `text/plain` (sin preflight CORS); también se acepta JSON. */
  private async parseBatch(body: unknown): Promise<CollectBatchDto> {
    let payload = body;
    if (typeof body === 'string') {
      try {
        payload = JSON.parse(body);
      } catch {
        throw new BadRequestException('Cuerpo de analítica inválido');
      }
    }
    if (!payload || typeof payload !== 'object') throw new BadRequestException('Cuerpo de analítica inválido');
    const dto = plainToInstance(CollectBatchDto, payload);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) throw new BadRequestException('Cuerpo de analítica inválido');
    return dto;
  }

  private async processEvent(event: CollectEventDto, context: Context): Promise<Prisma.analytics_eventsCreateManyInput | null> {
    const path = normalizePath(event.path);
    if (!path) return null;

    const props = event.type === 'event' ? this.validateProps(event) : null;
    if (event.type === 'event' && (!event.name || !props)) return null;

    const occurredAt = new Date(context.now - Math.min(Math.max(event.ageMs ?? 0, 0), MAX_EVENT_AGE_MS));
    const identified = Boolean(event.visitorId && event.sessionId);

    if (event.type === 'ping') {
      if (identified) await this.touchSession(event.sessionId!, event.visitorId!, occurredAt);
      return null;
    }

    const attribution: Attribution = {
      referrerHost: event.attribution?.referrerHost?.toLowerCase() ?? null,
      utmSource: clean(event.attribution?.utmSource),
      utmMedium: clean(event.attribution?.utmMedium),
      utmCampaign: clean(event.attribution?.utmCampaign),
      paidClick: event.attribution?.paidClick === true,
    };
    const channel = classifyChannel(attribution);
    const conversion = event.type === 'event' && isConversion(event.name!, props!);

    if (identified) {
      const counted = await this.trackSession(event, path, channel, conversion, occurredAt);
      if (!counted) return null;
    }

    return {
      occurred_at: occurredAt,
      event_type: event.type,
      event_name: event.type === 'event' ? event.name : null,
      is_conversion: conversion,
      path,
      visitor_id: identified ? event.visitorId : null,
      session_id: identified ? event.sessionId : null,
      is_entrance: event.type === 'pageview' && event.entrance === true,
      channel,
      referrer_host: attribution.referrerHost,
      utm_source: attribution.utmSource,
      utm_medium: attribution.utmMedium,
      utm_campaign: attribution.utmCampaign,
      utm_term: clean(event.attribution?.utmTerm),
      utm_content: clean(event.attribution?.utmContent),
      device_type: context.device.deviceType,
      browser: context.device.browser,
      os: context.device.os,
      country: context.geo.country,
      region: context.geo.region,
      props: props && Object.keys(props).length > 0 ? props : undefined,
    };
  }

  /** Solo claves de la lista blanca del evento y valores con forma de identificador. */
  private validateProps(event: CollectEventDto): Record<string, string> | null {
    if (!event.name) return null;
    const allowed: readonly string[] = ANALYTICS_EVENTS[event.name].props;
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(event.props ?? {})) {
      if (!allowed.includes(key) || typeof value !== 'string' || !PROP_VALUE_PATTERN.test(value)) return null;
      result[key] = value;
    }
    return result;
  }

  /**
   * Crea o actualiza la sesión seudónima. Devuelve false si el registro no
   * debe contarse (sesión de otro visitante o que superó el tope de registros).
   */
  private async trackSession(
    event: CollectEventDto,
    path: string,
    channel: string,
    conversion: boolean,
    at: Date,
  ): Promise<boolean> {
    const sessionId = event.sessionId!;
    const visitorId = event.visitorId!;
    const isPageview = event.type === 'pageview';
    const increments = {
      pageviews: isPageview ? 1 : 0,
      events: isPageview ? 0 : 1,
      conversions: conversion ? 1 : 0,
    };

    const existing = await this.prisma.analytics_sessions.findUnique({ where: { id: sessionId } });
    if (!existing) {
      await this.prisma.analytics_visitors.upsert({
        where: { id: visitorId },
        create: { id: visitorId, first_seen_at: at, last_seen_at: at },
        update: { last_seen_at: at },
      });
      try {
        await this.prisma.analytics_sessions.create({
          data: {
            id: sessionId,
            visitor_id: visitorId,
            started_at: at,
            last_activity_at: at,
            ...increments,
            entry_path: path,
            exit_path: isPageview ? path : null,
            channel,
          },
        });
        return true;
      } catch (error) {
        // Dos envíos simultáneos de la misma sesión nueva: el segundo actualiza.
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
        return this.trackSession(event, path, channel, conversion, at);
      }
    }

    if (existing.visitor_id !== visitorId) return false;
    if (existing.pageviews + existing.events >= MAX_HITS_PER_SESSION) return false;

    const withinWindow = at.getTime() - existing.last_activity_at.getTime() <= SESSION_GRACE_MS;
    await this.prisma.analytics_sessions.update({
      where: { id: sessionId },
      data: {
        pageviews: { increment: increments.pageviews },
        events: { increment: increments.events },
        conversions: { increment: increments.conversions },
        ...(withinWindow && at > existing.last_activity_at && { last_activity_at: at }),
        ...(isPageview && { exit_path: path }),
      },
    });
    await this.prisma.analytics_visitors.update({ where: { id: visitorId }, data: { last_seen_at: at } });
    return true;
  }

  /** `ping` (pestaña oculta / cierre): extiende la duración medible de la sesión, sin crear un registro. */
  private async touchSession(sessionId: string, visitorId: string, at: Date): Promise<void> {
    await this.prisma.analytics_sessions.updateMany({
      where: {
        id: sessionId,
        visitor_id: visitorId,
        last_activity_at: { gte: new Date(at.getTime() - SESSION_GRACE_MS), lt: at },
      },
      data: { last_activity_at: at },
    });
  }
}

/** Los UTM son texto que controla quien arma el enlace: un valor con correo electrónico no se guarda. */
function clean(value: string | undefined): string | null {
  // eslint-disable-next-line no-control-regex
  const trimmed = value?.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (!trimmed || trimmed.includes('@')) return null;
  return trimmed.slice(0, 150);
}
