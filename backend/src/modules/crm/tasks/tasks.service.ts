import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TASK_REPOSITORY, TaskRepository } from './repositories/task.repository.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: TaskRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.findAll();
  }

  async findOne(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return task;
  }

  async create(dto: CreateTaskDto, actorEmail: string): Promise<TaskEntity> {
    const created = await this.taskRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      assigneeUserId: dto.assigneeUserId ?? null,
      priority: dto.priority ?? 'MEDIUM',
      status: dto.status ?? 'PENDING',
      relatedType: dto.relatedType ?? null,
      relatedId: dto.relatedId ?? null,
    });
    this.auditService.log(actorEmail, 'tasks.create', `Tarea creada: ${created.title}`);
    return created;
  }

  async update(id: string, dto: UpdateTaskDto, actorEmail: string): Promise<TaskEntity> {
    await this.findOne(id);
    const updated = await this.taskRepository.update(id, {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
    if (!updated) {
      throw new NotFoundException('Tarea no encontrada');
    }
    this.auditService.log(actorEmail, 'tasks.update', `Tarea actualizada: ${updated.title}`);
    return updated;
  }

  async assign(id: string, assigneeUserId: string, actorEmail: string): Promise<TaskEntity> {
    await this.findOne(id);
    const updated = await this.taskRepository.update(id, { assigneeUserId });
    if (!updated) {
      throw new NotFoundException('Tarea no encontrada');
    }
    this.auditService.log(actorEmail, 'tasks.assign', `Tarea asignada: ${updated.title}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.delete(id);
    this.auditService.log(actorEmail, 'tasks.delete', `Tarea eliminada: ${task.title}`);
  }

  count(): Promise<number> {
    return this.taskRepository.count();
  }

  async countPending(): Promise<number> {
    const all = await this.taskRepository.findAll();
    return all.filter((t) => t.status === 'PENDING').length;
  }
}
