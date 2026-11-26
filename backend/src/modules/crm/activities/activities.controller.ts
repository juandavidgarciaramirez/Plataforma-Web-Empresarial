import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('CRM - Actividades')
@ApiBearerAuth()
@Controller('crm/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @Permissions('crm.activities.read')
  @ApiOperation({ summary: 'Listar actividades (llamadas, correos, reuniones y notas)' })
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  @Permissions('crm.activities.read')
  @ApiOperation({ summary: 'Obtener una actividad por id' })
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Post()
  @Permissions('crm.activities.create')
  @ApiOperation({ summary: 'Registrar una actividad' })
  create(@Body() dto: CreateActivityDto, @CurrentUser() user: RequestUser) {
    return this.activitiesService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('crm.activities.update')
  @ApiOperation({ summary: 'Actualizar una actividad' })
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto, @CurrentUser() user: RequestUser) {
    return this.activitiesService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('crm.activities.delete')
  @ApiOperation({ summary: 'Eliminar una actividad' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.activitiesService.remove(id, user.email);
  }
}
