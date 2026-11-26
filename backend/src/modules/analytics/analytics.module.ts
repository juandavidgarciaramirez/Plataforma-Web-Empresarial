import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsCollectorService } from './analytics-collector.service';
import { AnalyticsReportService } from './analytics-report.service';
import { AnalyticsRetentionService } from './analytics-retention.service';

/** Analítica web propia del sitio público (Etapa 15) — ver docs/media-y-analitica.md. */
@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsCollectorService, AnalyticsReportService, AnalyticsRetentionService],
})
export class AnalyticsModule {}
