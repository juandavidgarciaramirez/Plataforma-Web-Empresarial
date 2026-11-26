import { Body, Controller, Get, HttpCode, Post, Query, Req, Res } from '@nestjs/common';
import { InjectThrottlerStorage, Throttle, ThrottlerStorage } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AnalyticsCollectorService } from './analytics-collector.service';
import { AnalyticsReportService } from './analytics-report.service';
import { ExportQueryDto, PagesQueryDto, ReportQueryDto } from './dto/report-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PostgresThrottlerStorage } from '../../common/throttler/postgres-throttler.storage';
import { extractClientIp, rateLimitIdentity } from '../../common/utils/request-ip.util';

/** Envíos por minuto e IP aceptados en la recepción pública (`ANALYTICS_RATE_LIMIT`, por defecto 120). */
const collectLimit = () => Number.parseInt(process.env.ANALYTICS_RATE_LIMIT ?? '', 10) || 120;

@ApiTags('Analítica web')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly collector: AnalyticsCollectorService,
    private readonly reports: AnalyticsReportService,
    @InjectThrottlerStorage() private readonly throttlerStorage: ThrottlerStorage,
  ) {}

  /**
   * Recepción pública del sitio. Responde 202 aunque descarte eventos
   * (origen no permitido, bot, ruta excluida): no revela por qué.
   */
  @Public()
  @Post('collect')
  @HttpCode(202)
  @Throttle({ default: { limit: () => collectLimit(), ttl: 60_000 } })
  @ApiOperation({ summary: 'Registrar páginas vistas y eventos del sitio público (sin datos personales)' })
  collect(@Body() body: unknown, @Req() request: Request) {
    return this.collector.collect(body, request);
  }

  /**
   * Verificación tras desplegar: cómo resuelve el backend la IP del propio
   * administrador detrás del proxy y qué contador usa (ver
   * docs/despliegue-etapa-15.md). No expone datos de otros visitantes.
   */
  @Get('diagnostics')
  @ApiBearerAuth()
  @Permissions('analytics.dashboard.read')
  @ApiOperation({ summary: 'Diagnóstico de identificación de cliente y rate limiting' })
  diagnostics(@Req() request: Request) {
    return {
      clientIp: extractClientIp(request),
      rateLimitIdentity: rateLimitIdentity(request.ip),
      socketAddress: request.socket.remoteAddress ?? null,
      forwardedFor: request.headers['x-forwarded-for'] ?? null,
      trustProxyHops: process.env.TRUST_PROXY_HOPS ?? 'auto (solo conexiones locales)',
      rateLimitStore: this.throttlerStorage instanceof PostgresThrottlerStorage ? this.throttlerStorage.mode : 'desconocido',
    };
  }

  @Get('report')
  @ApiBearerAuth()
  @Permissions('analytics.dashboard.read')
  @ApiOperation({ summary: 'Indicadores, serie temporal, fuentes, dispositivos y eventos del periodo' })
  report(@Query() query: ReportQueryDto) {
    return this.reports.report(query.from, query.to, query.compare ?? true);
  }

  @Get('pages')
  @ApiBearerAuth()
  @Permissions('analytics.dashboard.read')
  @ApiOperation({ summary: 'Páginas más visitadas (paginado)' })
  pages(@Query() query: PagesQueryDto) {
    return this.reports.pages(query.from, query.to, query.page, query.pageSize, query.search);
  }

  @Get('export')
  @ApiBearerAuth()
  @Permissions('analytics.dashboard.read', 'analytics.reports.export')
  @ApiOperation({ summary: 'Exportar un informe en CSV' })
  async export(@Query() query: ExportQueryDto, @Res() res: Response) {
    const csv = await this.reports.exportCsv(query.report, query.from, query.to);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="analitica-${query.report}-${query.from}_${query.to}.csv"`);
    res.setHeader('Cache-Control', 'no-store');
    res.send(csv);
  }
}
