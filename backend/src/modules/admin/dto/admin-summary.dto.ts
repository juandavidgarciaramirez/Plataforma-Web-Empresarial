import { ApiProperty } from '@nestjs/swagger';

/**
 * Los 6 widgets del dashboard (brief "ADMIN DASHBOARD"). `pendingPqrs` y
 * `recentApplications` siguen siendo demo hasta que PQR/Talento tengan su
 * propio módulo en `backend/` (Fase 8) — el resto ya sale de datos reales
 * del CRM (`CrmModule`).
 */
export class AdminSummaryDto {
  @ApiProperty({ description: 'Leads nuevos (estado NEW)' }) leadsNew!: number;
  @ApiProperty({ description: 'Oportunidades abiertas (no ganadas/perdidas)' }) opportunitiesOpen!: number;
  @ApiProperty({ description: 'Suma del valor de las oportunidades abiertas' }) pipelineValue!: number;
  @ApiProperty({ description: 'Tareas pendientes' }) tasksPending!: number;
  @ApiProperty({ description: 'PQR abiertas (demo hasta la Fase 8)' }) pendingPqrs!: number;
  @ApiProperty({ description: 'Postulaciones recientes (demo hasta la Fase 8)' }) recentApplications!: number;

  @ApiProperty() totalUsers!: number;
  @ApiProperty() totalRoles!: number;
  @ApiProperty() totalPermissions!: number;
}

class ActivityItem {
  @ApiProperty() id!: string;
  @ApiProperty() description!: string;
  @ApiProperty() time!: string;
}

export class AdminActivityDto {
  @ApiProperty({ type: [ActivityItem] }) recentActivities!: ActivityItem[];
}

class PipelineStagePoint {
  @ApiProperty() stage!: string;
  @ApiProperty() count!: number;
  @ApiProperty() totalValue!: number;
}

class LeadsBySourcePoint {
  @ApiProperty() source!: string;
  @ApiProperty() count!: number;
}

class LeadsByServicePoint {
  @ApiProperty() service!: string;
  @ApiProperty() count!: number;
}

/** Datos para los 3 gráficos del dashboard: pipeline por etapa, leads por fuente y por servicio. */
export class AdminCrmChartsDto {
  @ApiProperty({ type: [PipelineStagePoint] }) pipelineByStage!: PipelineStagePoint[];
  @ApiProperty({ type: [LeadsBySourcePoint] }) leadsBySource!: LeadsBySourcePoint[];
  @ApiProperty({ type: [LeadsByServicePoint] }) leadsByService!: LeadsByServicePoint[];
}
