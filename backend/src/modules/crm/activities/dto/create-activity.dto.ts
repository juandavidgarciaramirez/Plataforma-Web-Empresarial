import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CRM_ENTITY_TYPES, CrmEntityType } from '../../common/crm.types';
import { ACTIVITY_TYPES, ActivityType } from '../entities/activity.entity';

export class CreateActivityDto {
  @ApiProperty({ enum: ACTIVITY_TYPES, default: 'NOTE' })
  @IsIn(ACTIVITY_TYPES)
  type!: ActivityType;

  @ApiProperty({ example: 'Llamada de seguimiento: interesado en Capital Learning para 40 personas.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ description: 'Usuario que registra la actividad' })
  @IsOptional()
  @IsString()
  authorUserId?: string;

  @ApiPropertyOptional({ description: 'Por defecto, ahora mismo' })
  @IsOptional()
  @IsDateString()
  occurredAt?: string;

  @ApiPropertyOptional({ enum: CRM_ENTITY_TYPES, description: 'Tipo de entidad relacionada, si aplica' })
  @IsOptional()
  @IsIn(CRM_ENTITY_TYPES)
  relatedType?: CrmEntityType;

  @ApiPropertyOptional({ description: 'Id de la entidad relacionada (lead, empresa, contacto u oportunidad)' })
  @IsOptional()
  @IsString()
  relatedId?: string;
}
