import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { retentionDays } from './analytics.constants';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Retención configurable de la analítica (`ANALYTICS_RETENTION_DAYS`, por
 * defecto 395 ≈ 13 meses, mínimo 30). Se ejecuta poco después de arrancar y
 * luego una vez al día; sin dependencias de programación de tareas.
 */
@Injectable()
export class AnalyticsRetentionService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger('AnalyticsRetention');
  private timers: NodeJS.Timeout[] = [];

  constructor(private readonly prisma: PrismaService) {}

  onApplicationBootstrap(): void {
    this.timers.push(setTimeout(() => void this.purge(), 60_000).unref());
    this.timers.push(setInterval(() => void this.purge(), DAY_MS).unref());
  }

  onApplicationShutdown(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
  }

  async purge(): Promise<void> {
    const days = retentionDays();
    const cutoff = new Date(Date.now() - days * DAY_MS);
    try {
      const events = await this.prisma.analytics_events.deleteMany({ where: { occurred_at: { lt: cutoff } } });
      const sessions = await this.prisma.analytics_sessions.deleteMany({ where: { started_at: { lt: cutoff } } });
      const visitors = await this.prisma.analytics_visitors.deleteMany({ where: { last_seen_at: { lt: cutoff } } });
      if (events.count + sessions.count + visitors.count > 0) {
        this.logger.log(
          `Retención de ${days} días: ${events.count} eventos, ${sessions.count} sesiones y ${visitors.count} visitantes eliminados.`,
        );
      }
    } catch (error) {
      this.logger.error(`No se pudo aplicar la retención de analítica: ${(error as Error).message}`);
    }
  }
}
