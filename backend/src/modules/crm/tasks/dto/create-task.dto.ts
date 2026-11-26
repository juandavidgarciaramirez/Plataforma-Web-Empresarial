import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CRM_ENTITY_TYPES, CrmEntityType } from '../../common/crm.types';
import { TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Llamar para agendar demo de Capital Learning' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeUserId?: string;

  @ApiPropertyOptional({ enum: TASK_PRIORITIES, default: 'MEDIUM' })
  @IsOptional()
  @IsIn(TASK_PRIORITIES)
  priority?: TaskPriority;

  @ApiPropertyOptional({ enum: TASK_STATUSES, default: 'PENDING' })
  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: CRM_ENTITY_TYPES, description: 'Tipo de entidad relacionada, si aplica' })
  @IsOptional()
  @IsIn(CRM_ENTITY_TYPES)
  relatedType?: CrmEntityType;

  @ApiPropertyOptional({ description: 'Id de la entidad relacionada (lead, empresa, contacto u oportunidad)' })
  @IsOptional()
  @IsString()
  relatedId?: string;
}
