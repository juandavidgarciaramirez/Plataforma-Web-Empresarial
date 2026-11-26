import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { APPLICATION_STATUSES, ApplicationStatus } from '../entities/application.entity';

export class UpdateApplicationDto {
  @ApiPropertyOptional({ enum: APPLICATION_STATUSES })
  @IsOptional()
  @IsIn(APPLICATION_STATUSES)
  status?: ApplicationStatus;
}
