import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ACTIVITY_REPOSITORY, ActivityRepository } from './repositories/activity.repository.interface';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityEntity } from './entities/activity.entity';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY) private readonly activityRepository: ActivityRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<ActivityEntity[]> {
    return this.activityRepository.findAll();
  }

  async findOne(id: string): Promise<ActivityEntity> {
    const activity = await this.activityRepository.findById(id);
    if (!activity) {
      throw new NotFoundException('Actividad no encontrada');
    }
    return activity;
  }

  async create(dto: CreateActivityDto, actorEmail: string): Promise<ActivityEntity> {
    const created = await this.activityRepository.create({
      type: dto.type,
      description: dto.description,
      authorUserId: dto.authorUserId ?? null,
      occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
      relatedType: dto.relatedType ?? null,
      relatedId: dto.relatedId ?? null,
    });
    this.auditService.log(actorEmail, 'activities.create', `Actividad registrada: ${created.type}`);
    return created;
  }

  async update(id: string, dto: UpdateActivityDto, actorEmail: string): Promise<ActivityEntity> {
    await this.findOne(id);
    const updated = await this.activityRepository.update(id, {
      ...dto,
      occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
    });
    if (!updated) {
      throw new NotFoundException('Actividad no encontrada');
    }
    this.auditService.log(actorEmail, 'activities.update', `Actividad actualizada: ${updated.type}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const activity = await this.findOne(id);
    await this.activityRepository.delete(id);
    this.auditService.log(actorEmail, 'activities.delete', `Actividad eliminada: ${activity.type}`);
  }

  count(): Promise<number> {
    return this.activityRepository.count();
  }
}
