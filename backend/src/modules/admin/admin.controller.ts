import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Métricas resumidas para el dashboard administrativo' })
  getSummary() {
    return this.adminService.getSummary();
  }

  @Get('activity')
  @Permissions('audit.logs.read')
  @ApiOperation({ summary: 'Actividad reciente del sistema (bitácora)' })
  getActivity() {
    return this.adminService.getActivity();
  }

  @Get('crm-charts')
  @ApiOperation({ summary: 'Datos para los gráficos del dashboard: pipeline por etapa, leads por fuente y por servicio' })
  getCrmCharts() {
    return this.adminService.getCrmCharts();
  }
}
