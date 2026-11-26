import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('CRM - Tareas')
@ApiBearerAuth()
@Controller('crm/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @Permissions('crm.tasks.read')
  @ApiOperation({ summary: 'Listar tareas' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @Permissions('crm.tasks.read')
  @ApiOperation({ summary: 'Obtener una tarea por id' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @Permissions('crm.tasks.create')
  @ApiOperation({ summary: 'Crear una tarea' })
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('crm.tasks.update')
  @ApiOperation({ summary: 'Actualizar una tarea (incluye marcarla como completada)' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.update(id, dto, user.email);
  }

  @Patch(':id/assign')
  @Permissions('crm.tasks.assign')
  @ApiOperation({ summary: 'Asignar la tarea a un usuario' })
  assign(@Param('id') id: string, @Body() dto: AssignTaskDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.assign(id, dto.assigneeUserId, user.email);
  }

  @Delete(':id')
  @Permissions('crm.tasks.delete')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tasksService.remove(id, user.email);
  }
}
