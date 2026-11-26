import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { PermissionsService } from '../permissions/permissions.service';
import { AuditService } from '../audit/audit.service';
import { LeadsService } from '../crm/leads/leads.service';
import { PqrService } from '../pqr/pqr.service';
import { ApplicationsService } from '../careers/applications/applications.service';
import { OpportunitiesService } from '../crm/opportunities/opportunities.service';
import { TasksService } from '../crm/tasks/tasks.service';
import { AdminActivityDto, AdminCrmChartsDto, AdminSummaryDto } from './dto/admin-summary.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
    private readonly auditService: AuditService,
    private readonly leadsService: LeadsService,
    private readonly opportunitiesService: OpportunitiesService,
    private readonly tasksService: TasksService,
    private readonly pqrService: PqrService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async getSummary(): Promise<AdminSummaryDto> {
    const [
      totalUsers,
      totalRoles,
      totalPermissions,
      leadsNew,
      opportunitiesOpen,
      pipelineValue,
      tasksPending,
      pendingPqrs,
      recentApplications,
    ] = await Promise.all([
      this.usersService.count(),
      this.rolesService.findAll().then((r) => r.length),
      this.permissionsService.findAll().then((p) => p.length),
      this.leadsService.countNew(),
      this.opportunitiesService.countOpen(),
      this.opportunitiesService.openPipelineValue(),
      this.tasksService.countPending(),
      this.pqrService.countOpen(),
      this.applicationsService.countRecent(),
    ]);

    return {
      leadsNew,
      opportunitiesOpen,
      pipelineValue,
      tasksPending,
      pendingPqrs,
      recentApplications,
      totalUsers,
      totalRoles,
      totalPermissions,
    };
  }

  async getActivity(): Promise<AdminActivityDto> {
    const entries = await this.auditService.recent(20);

    return {
      recentActivities: entries.map((entry) => ({
        id: entry.id,
        description: entry.description,
        time: formatRelativeTime(entry.createdAt),
      })),
    };
  }

  async getCrmCharts(): Promise<AdminCrmChartsDto> {
    const [pipeline, leadsBySource, leadsByService] = await Promise.all([
      this.opportunitiesService.getPipelineBoard(),
      this.leadsService.groupedBySource(),
      this.leadsService.groupedByService(),
    ]);

    return {
      pipelineByStage: pipeline.map((column) => ({
        stage: column.stage,
        count: column.count,
        totalValue: column.totalValue,
      })),
      leadsBySource,
      leadsByService,
    };
  }
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Hace instantes';
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}
